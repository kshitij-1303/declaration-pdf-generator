module.exports = (str) => {
  let word = "";
  if (str == "IFSC") {
    return str;
  }
  Array.from(str).forEach((elem, index) => {
    elem = index == 0 ? elem.toUpperCase() : elem;

    if (index > 0) {
      if (elem == elem.toUpperCase()) {
        word += " ";
      }
    }
    word += elem;
  });
  return word;
};
