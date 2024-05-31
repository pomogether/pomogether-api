export const handleErrorWrapper = async <E extends Error = Error, T extends unknown = unknown>(
  fn: () => Promise<T>
) => {
  try {
    return await fn()
  } catch (error) {
    return error as E
  }
}
