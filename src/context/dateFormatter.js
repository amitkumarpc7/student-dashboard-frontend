export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; 

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};
