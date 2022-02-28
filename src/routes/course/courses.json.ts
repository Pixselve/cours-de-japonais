export async function get() {
  // Import all .svx files in the directory
  const modules = import.meta.glob("./**/*.md");
  console.log(modules);





  return {
    body: {}
  };
}
