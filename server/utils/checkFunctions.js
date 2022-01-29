exports.isExpiryReached = (expiryDateAsAString) => {
  let expiryDateAsADate = new Date(expiryDateAsAString);

  if (expiryDateAsADate - Date.now() < 0) {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
};
