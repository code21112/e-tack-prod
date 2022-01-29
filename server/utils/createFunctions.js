exports.toUpperCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(" ");
};

exports.capitalize = (string) => {
  string.charAt(0).toUpperCase() + string.substring(1);
};

exports.capitalizeAndTrim = (string) => {
  let stringMod = string.trim();
  return (
    stringMod.charAt(0).toUpperCase() + stringMod.substring(1).toLowerCase(0)
  );
};
