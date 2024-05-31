import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createRoomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(6),
    pomodoro: vine.number().min(1).max(59),
    shortBreak: vine.number().min(1).max(59),
    longBreak: vine.number().min(1).max(59),
    cycles: vine.number().min(1).max(59),
  })
)
