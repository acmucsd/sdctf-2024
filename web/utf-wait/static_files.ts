export const HTML = await Deno.readTextFile(
  new URL('./static/index.html', import.meta.url)
)
