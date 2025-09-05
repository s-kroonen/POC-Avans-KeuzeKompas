document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("pageSize");
  if (select) {
    select.addEventListener("change", () => {
      // reset page to 1 when pageSize changes
      document.querySelector('input[name="page"]').value = 1;
      select.form.submit();
    });
  }
});
