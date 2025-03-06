export const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
