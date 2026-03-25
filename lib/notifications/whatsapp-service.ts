import { sql } from "@/lib/db"

// Message templates for different notification types
export const MESSAGE_TEMPLATES = {
  // Aggregator notifications
  SUPPLY_ORDER_ASSIGNED: (data: { crop: string; quantity: number; deadline: string; corridor: string }) =>
    `*New Supply Order*\n\nYou have been assigned a new supply order:\n\n` +
    `Crop: ${data.crop}\n` +
    `Quantity: ${data.quantity.toLocaleString()} MT\n` +
    `Deadline: ${data.deadline}\n` +
    `Corridor: ${data.corridor}\n\n` +
    `Please log in to your AgroBridge dashboard to review and accept this order.`,

  COLLECTION_REMINDER: (data: { crop: string; remaining: number; deadline: string }) =>
    `*Collection Reminder*\n\n` +
    `You have ${data.remaining.toLocaleString()} MT of ${data.crop} remaining to collect.\n` +
    `Deadline: ${data.deadline}\n\n` +
    `Please ensure timely collection to meet delivery schedules.`,

  DELIVERY_SCHEDULED: (data: { crop: string; quantity: number; date: string; location: string }) =>
    `*Delivery Scheduled*\n\n` +
    `Your delivery has been scheduled:\n\n` +
    `Crop: ${data.crop}\n` +
    `Quantity: ${data.quantity.toLocaleString()} MT\n` +
    `Date: ${data.date}\n` +
    `Location: ${data.location}\n\n` +
    `Please ensure the produce is ready for pickup.`,

  // Buyer notifications
  PLANNING_INTEREST_RECEIVED: (data: { refId: string; crop: string; quantity: number }) =>
    `*Planning Interest Received*\n\n` +
    `Thank you for submitting your planning interest.\n\n` +
    `Reference: ${data.refId}\n` +
    `Crop: ${data.crop}\n` +
    `Quantity: ${data.quantity.toLocaleString()} MT\n\n` +
    `Our team will review your request and get back to you shortly.`,

  PLANNING_INTEREST_APPROVED: (data: { refId: string; crop: string; quantity: number }) =>
    `*Planning Interest Approved*\n\n` +
    `Great news! Your planning interest has been approved.\n\n` +
    `Reference: ${data.refId}\n` +
    `Crop: ${data.crop}\n` +
    `Quantity: ${data.quantity.toLocaleString()} MT\n\n` +
    `We will begin coordinating supply for your order. You'll receive updates as we progress.`,

  SUPPLY_PROGRESS_UPDATE: (data: { crop: string; collected: number; total: number; percentage: number }) =>
    `*Supply Progress Update*\n\n` +
    `Your ${data.crop} order is progressing:\n\n` +
    `Collected: ${data.collected.toLocaleString()} / ${data.total.toLocaleString()} MT\n` +
    `Progress: ${data.percentage}%\n\n` +
    `We'll notify you when the full quantity is ready for delivery.`,

  DELIVERY_READY: (data: { crop: string; quantity: number; location: string }) =>
    `*Delivery Ready*\n\n` +
    `Your order is ready for delivery:\n\n` +
    `Crop: ${data.crop}\n` +
    `Quantity: ${data.quantity.toLocaleString()} MT\n` +
    `Pickup Location: ${data.location}\n\n` +
    `Please confirm your delivery schedule in your AgroBridge dashboard.`,

  // Ops notifications
  NEW_REGISTRATION: (data: { name: string; role: string; region: string }) =>
    `*New Registration*\n\n` +
    `A new ${data.role} has registered:\n\n` +
    `Name: ${data.name}\n` +
    `Region: ${data.region}\n\n` +
    `Please review the application in the AgroBridge admin dashboard.`,

  QUALITY_ISSUE_FLAGGED: (data: { aggregator: string; crop: string; issue: string }) =>
    `*Quality Issue Flagged*\n\n` +
    `A quality issue has been reported:\n\n` +
    `Aggregator: ${data.aggregator}\n` +
    `Crop: ${data.crop}\n` +
    `Issue: ${data.issue}\n\n` +
    `Please investigate and take appropriate action.`,

  // Generic
  CUSTOM: (message: string) => message,
} as const

export type NotificationType = keyof typeof MESSAGE_TEMPLATES

export type NotificationChannel = "whatsapp" | "sms" | "email"

interface SendNotificationParams {
  recipientId: string
  recipientPhone: string
  recipientName?: string
  type: NotificationType
  channel?: NotificationChannel
  templateData?: Record<string, unknown>
  customMessage?: string
  relatedEntityType?: string
  relatedEntityId?: string
}

interface NotificationResult {
  success: boolean
  logId?: string
  error?: string
}

/**
 * Format phone number for WhatsApp API (E.164 format)
 * Nigerian numbers: +234...
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "")
  
  // Handle Nigerian numbers
  if (cleaned.startsWith("0")) {
    cleaned = "234" + cleaned.substring(1)
  }
  
  // Add + prefix if not present
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }
  
  return cleaned
}

/**
 * Send a WhatsApp notification via the configured provider
 * Currently supports: Twilio, MessageBird, or direct WhatsApp Business API
 */
async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const formattedPhone = formatPhoneNumber(phone)
  
  // Check for WhatsApp API credentials
  const apiKey = process.env.WHATSAPP_API_KEY
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER

  // If no credentials configured, log and return success (for development)
  if (!apiKey && !accountSid) {
    console.log(`[WhatsApp] Would send to ${formattedPhone}:`, message)
    return { 
      success: true, 
      messageId: `dev_${Date.now()}`,
    }
  }

  // Twilio integration
  if (accountSid && authToken && twilioWhatsAppNumber) {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: `whatsapp:${twilioWhatsAppNumber}`,
            To: `whatsapp:${formattedPhone}`,
            Body: message,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const data = await response.json()
      return { success: true, messageId: data.sid }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  }

  // Generic WhatsApp Business API integration
  if (apiKey) {
    const apiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v17.0"
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

    try {
      const response = await fetch(
        `${apiUrl}/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: formattedPhone.replace("+", ""),
            type: "text",
            text: { body: message },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const data = await response.json()
      return { success: true, messageId: data.messages?.[0]?.id }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  }

  return { success: false, error: "No WhatsApp provider configured" }
}

/**
 * Main function to send a notification and log it
 */
export async function sendNotification(
  params: SendNotificationParams
): Promise<NotificationResult> {
  const {
    recipientId,
    recipientPhone,
    recipientName,
    type,
    channel = "whatsapp",
    templateData = {},
    customMessage,
    relatedEntityType,
    relatedEntityId,
  } = params

  // Generate message from template
  let message: string
  if (type === "CUSTOM" && customMessage) {
    message = MESSAGE_TEMPLATES.CUSTOM(customMessage)
  } else {
    const templateFn = MESSAGE_TEMPLATES[type]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message = (templateFn as any)(templateData)
  }

  // Create log entry first (pending status)
  const [logEntry] = await sql`
    INSERT INTO notification_logs (
      recipient_id,
      recipient_phone,
      recipient_name,
      channel,
      notification_type,
      message_content,
      template_data,
      related_entity_type,
      related_entity_id,
      status
    ) VALUES (
      ${recipientId}::uuid,
      ${recipientPhone},
      ${recipientName || null},
      ${channel},
      ${type},
      ${message},
      ${JSON.stringify(templateData)},
      ${relatedEntityType || null},
      ${relatedEntityId || null},
      'pending'
    )
    RETURNING id
  `

  const logId = logEntry.id

  // Send the message
  let result: { success: boolean; messageId?: string; error?: string }

  if (channel === "whatsapp") {
    result = await sendWhatsAppMessage(recipientPhone, message)
  } else {
    // SMS and email can be added here
    result = { success: false, error: `Channel ${channel} not implemented` }
  }

  // Update log with result
  if (result.success) {
    await sql`
      UPDATE notification_logs
      SET 
        status = 'sent',
        external_message_id = ${result.messageId || null},
        sent_at = NOW()
      WHERE id = ${logId}::uuid
    `
    return { success: true, logId }
  } else {
    await sql`
      UPDATE notification_logs
      SET 
        status = 'failed',
        error_message = ${result.error || 'Unknown error'},
        retry_count = retry_count + 1
      WHERE id = ${logId}::uuid
    `
    return { success: false, logId, error: result.error }
  }
}

/**
 * Send notification to multiple recipients
 */
export async function sendBulkNotifications(
  recipients: Array<{ id: string; phone: string; name?: string }>,
  type: NotificationType,
  templateData: Record<string, unknown>,
  relatedEntityType?: string,
  relatedEntityId?: string
): Promise<{ sent: number; failed: number; results: NotificationResult[] }> {
  const results: NotificationResult[] = []
  let sent = 0
  let failed = 0

  for (const recipient of recipients) {
    const result = await sendNotification({
      recipientId: recipient.id,
      recipientPhone: recipient.phone,
      recipientName: recipient.name,
      type,
      templateData,
      relatedEntityType,
      relatedEntityId,
    })

    results.push(result)
    if (result.success) {
      sent++
    } else {
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return { sent, failed, results }
}

/**
 * Check if a user has opted in to notifications
 */
export async function checkNotificationPreference(
  userId: string,
  channel: NotificationChannel = "whatsapp"
): Promise<boolean> {
  const [pref] = await sql`
    SELECT whatsapp_enabled, sms_enabled, email_enabled
    FROM notification_preferences
    WHERE user_id = ${userId}::uuid
  `

  if (!pref) {
    // Default to enabled if no preference set
    return true
  }

  switch (channel) {
    case "whatsapp":
      return pref.whatsapp_enabled
    case "sms":
      return pref.sms_enabled
    case "email":
      return pref.email_enabled
    default:
      return true
  }
}

/**
 * Helper to validate UUID before sending
 */
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Safe notification sender that validates UUID first
 */
export async function safeSendNotification(
  params: SendNotificationParams
): Promise<NotificationResult> {
  // Skip for demo/invalid UUIDs
  if (!isValidUUID(params.recipientId)) {
    console.log(`[WhatsApp] Skipping notification for non-UUID recipient: ${params.recipientId}`)
    return { success: true, logId: "skipped" }
  }

  return sendNotification(params)
}
