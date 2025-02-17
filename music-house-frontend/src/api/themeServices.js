const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://loyal-art-production.up.railway.app/api/instrument/all", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));