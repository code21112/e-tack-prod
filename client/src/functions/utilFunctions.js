export const sortByAlphabeticalOrder = (arr) => {
  let newArr = arr.sort((a, b) => a.localeCompare(b));
  return newArr;
};

export const getFirstNameTrimmedCapitalizedLimitedTo14Chars = (string) => {
  let stringTrimmed = string.trim();
  let firstElement = stringTrimmed.split("@")[0];

  firstElement = firstElement.split(" ")[0];

  if (firstElement.length === stringTrimmed.length) {
    firstElement = firstElement.split(".")[0];
  }

  if (firstElement.length === stringTrimmed.length) {
    firstElement = firstElement.split("_")[0];
  }

  let firstElementCapitalized =
    firstElement.charAt(0).toUpperCase() +
    firstElement.substring(1).toLowerCase(0);

  let finalFirstElement;

  if (firstElementCapitalized.length > 14) {
    finalFirstElement = firstElementCapitalized.substring(0, 14) + "...";
  } else {
    finalFirstElement = firstElementCapitalized;
  }

  return finalFirstElement;
};

export const isObjectDuplicate = (array, candidate) => {
  const keysArrayFromArray = (array) => {
    let keysArray = [];
    for (let i = 0; i < array.length; i++) {
      keysArray.push(Object.keys(array[i]));
    }

    return keysArray;
  };

  // Creating an array of values fron an array of objects
  const valuesArrayFromArray = (array) => {
    let valuesArray = [];
    for (let i = 0; i < array.length; i++) {
      valuesArray.push(Object.values(array[i]));
    }
    return valuesArray;
  };

  let arrayTest = [
    { _id: 54646, name: "first", color: "Red" },
    { name: "second", color: "Brown", _id: 34433 },
    { name: "third", color: "Black", _id: 2345 },
  ];

  let objectTest = { color: "Red", _id: 3422, name: "third" };
  let objectValueDuplicate = { color: "Yellow", _id: 8383, name: "second" };
  let objectFullDuplicate = { color: "Red", _id: 54646, name: "first" };

  // console.log("keysArrayFromArray", keysArrayFromArray(arrayTest));
  // console.log("valuesArrayFromArray", valuesArrayFromArray(arrayTest));

  // Creating an array of keys from an object
  const keysArrayFromObject = (obj) => {
    return Object.keys(obj);
  };

  // Creating an array of values from an object
  const valuesArrayFromObject = (obj) => {
    return Object.values(obj);
  };

  // console.log("keysArrayFromObject", keysArrayFromObject(objectTest));
  // console.log("valuesArrayFromObject", valuesArrayFromObject(objectTest));

  let arrayOfKeysOfCandidate = keysArrayFromObject(candidate);
  let arrayOfValuesOfCandidate = valuesArrayFromObject(candidate);

  let arrayOfKeysFromArray = keysArrayFromArray(array);
  let arrayOfValuesFromArray = valuesArrayFromArray(array);

  // console.log("arrayOfKeysOfCandidate", arrayOfKeysOfCandidate);
  // console.log("arrayOfKeysOfCandidate.length", arrayOfKeysOfCandidate.length);

  //   console.log("arrayOfKeysFromArray", arrayOfKeysFromArray);
  //   console.log("arrayOfKeysFromArray[0].length", arrayOfKeysFromArray[0].length);

  //   console.log("arrayOfValuesFromArray", arrayOfValuesFromArray);

  //   console.log("arrayOfKeysOfCandidate", arrayOfKeysOfCandidate);
  // console.log("arrayOfValuesOfCandidate", arrayOfValuesOfCandidate);
  //   console.log("arrayOfKeysOfArray", arrayOfKeysOfArray);
  //   console.log("arrayOfValuesOfArray", arrayOfValuesOfArray);

  let arrayOfKeysOfArray = [];
  for (let i = 0; i < arrayOfKeysFromArray.length; i++) {
    if (arrayOfKeysFromArray[i].length >= arrayOfKeysOfCandidate.length) {
      arrayOfKeysOfArray.push(arrayOfKeysFromArray[i]);
    }
  }
  // console.log("arrayOfKeysOfArray", arrayOfKeysOfArray);

  let arrayOfValuesOfArray = [];
  for (let i = 0; i < arrayOfValuesFromArray.length; i++) {
    if (arrayOfValuesFromArray[i].length >= arrayOfValuesOfCandidate.length) {
      arrayOfValuesOfArray.push(arrayOfValuesFromArray[i]);
    }
  }
  // console.log("arrayOfValuesOfArray TEST", arrayOfValuesOfArray);

  /////////////////////////////////////////////////////////////////////////////////////
  //   Finding the index of each object key within the array of keys
  let indexFound;
  let indexElementFound;
  let indexesOfValuesToCheckFromKeysFound = [];
  let indexesOfValuesToCheckFromKeysFoundSingleArray = [];

  if (arrayOfKeysOfArray.length > 1) {
    for (let i = 0; i < arrayOfKeysOfCandidate.length; i++) {
      let indexesOfValuesToCheckFromKeysFoundForOneKey = [];
      for (let j = 0; j < arrayOfKeysOfArray.length; j++) {
        for (let k = 0; k < arrayOfKeysOfArray[j].length; k++) {
          if (arrayOfKeysOfCandidate[i] === arrayOfKeysOfArray[j][k]) {
            indexFound = j;
            indexElementFound = k;
            indexesOfValuesToCheckFromKeysFoundForOneKey.push([
              indexFound,
              indexElementFound,
            ]);
          }
        }
      }
      indexesOfValuesToCheckFromKeysFound.push(
        indexesOfValuesToCheckFromKeysFoundForOneKey
      );
    }
    // console.log(
    //   "indexesOfValuesToCheckFromKeysFound",
    //   indexesOfValuesToCheckFromKeysFound
    // );
  } else {
    for (let i = 0; i < arrayOfKeysOfCandidate.length; i++) {
      for (let j = 0; j < arrayOfKeysOfArray[0].length; j++) {
        if (arrayOfKeysOfCandidate[i] === arrayOfKeysOfArray[0][j]) {
          indexElementFound = j;
          indexesOfValuesToCheckFromKeysFoundSingleArray.push(
            indexElementFound
          );
        }
      }
    }
    // console.log(
    //   "indexesOfValuesToCheckFromKeysFoundSingleArray",
    //   indexesOfValuesToCheckFromKeysFoundSingleArray
    // );
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // Checking the values from the keys based on the indexes found previously

  let duplicatedKeyCount = 0;

  if (indexesOfValuesToCheckFromKeysFound) {
    // console.log("arrayOfValuesOfCandidate", arrayOfValuesOfCandidate);
    // console.log("arrayOfValuesOfArray", arrayOfValuesOfArray);
    for (let i = 0; i < arrayOfValuesOfCandidate.length; i++) {
      // console.log(`///////// ${i}`);
      for (let j = 0; j < arrayOfValuesOfArray.length; j++) {
        for (let k = 0; k < arrayOfValuesOfArray[j].length; k++) {
          let indexOfSubArray = j;
          let indexOfElementOfSubArray = k;

          //   console.log(
          //     "indexesOfValuesToCheckFromKeysFound[j][k]",
          //     indexesOfValuesToCheckFromKeysFound[j][k]
          //   );
          //   console.log(
          //     "arrayOfValuesOfCandidate[i] ",
          //     arrayOfValuesOfCandidate[i]
          //   );
          //   console.log(
          //     "arrayOfValuesOfArray[j][k]",
          //     arrayOfValuesOfArray[indexOfSubArray][indexOfElementOfSubArray]
          //   );
          //   console.log(
          //     "duplicatedKeyCount before if statement",
          //     duplicatedKeyCount
          //   );

          if (
            arrayOfValuesOfCandidate[i] ===
            arrayOfValuesOfArray[indexOfSubArray][indexOfElementOfSubArray]
          ) {
            // console.log("duplicatedValue found!!!");
            duplicatedKeyCount++;
          }
          // console.log(
          //   "duplicatedKeyCount within if indexesOfValuesToCheckFromKeysFound",
          //   duplicatedKeyCount
          // );
        }
      }
    }
  } else if (indexesOfValuesToCheckFromKeysFoundSingleArray) {
    // console.log("arrayOfValuesOfCandidate", arrayOfValuesOfCandidate);
    // console.log(
    //   "indexesOfValuesToCheckFromKeysFoundSingleArray",
    //   indexesOfValuesToCheckFromKeysFoundSingleArray
    // );
    for (let i = 0; i < arrayOfValuesOfCandidate.length; i++) {
      for (
        let j = 0;
        j < indexesOfValuesToCheckFromKeysFoundSingleArray.length;
        j++
      ) {
        if (
          arrayOfValuesOfCandidate[i] ===
          arrayOfValuesOfArray[
            indexesOfValuesToCheckFromKeysFoundSingleArray[j]
          ]
        ) {
          // console.log("duplicatedValue found!!!");

          duplicatedKeyCount++;
        }
        // console.log(
        //   "duplicatedKeyCount within else if indexesOfValuesToCheckFromKeysFoundSingleArrayclear",
        //   duplicatedKeyCount
        // );
      }
    }
  }

  // console.log("arrayOfKeysOfCandidate.length", arrayOfKeysOfCandidate.length);
  // console.log("duplicatedKeyCount", duplicatedKeyCount);

  if (arrayOfKeysOfCandidate.length !== duplicatedKeyCount) {
    return false;
  } else {
    return true;
  }
};

// console.log(
//   "isObjectDuplicate(arrayTest, objectTest)",
//   isObjectDuplicate(arrayTest, objectTest)
// );

// console.log(
//   "isObjectDuplicate(arrayTest, objectFullDuplicate)",
//   isObjectDuplicate(arrayTest, objectFullDuplicate)
// );

// let arrayTest2 = [
//   { _id: 54646, name: "first", color: "Red" },
//   { name: "second", color: "Brown", _id: 34433 },
//   {
//     name: "third",
//     color: "Black",
//     price: 23,
//     _id: 2345,
//     description: "njefnjfnnf in4fo4no4r fn4in4on",
//   },
// ];

// let objectTest2 = {
//   color: "Black",
//   price: 23,
//   _id: 2345,
//   name: "third",
//   description: "njefnjfnnf in4fo4no4r fn4in4on",
// };
// let objectTest3 = { color: "Black", _id: 2345, name: "third" };

// let objectTest4 = { color: "Black", _id: 2345, name: "thirrd" };

// console.log(
//   "isObjectDuplicate(arrayTest2, objectTest2)",
//   isObjectDuplicate(arrayTest2, objectTest2)
// );

// console.log(
//   "isObjectDuplicate(arrayTest2, objectTest3)",
//   isObjectDuplicate(arrayTest2, objectTest3)
// );

// console.log(
//   "isObjectDuplicate(arrayTest2, objectTest4)",
//   isObjectDuplicate(arrayTest2, objectTest4)
// );

////////////////////////////////////////////////////
// 2nd isObjectDuplicate ==> based on checking the id

export const isObjectDuplicateBasedOnId = (array, candidate) => {
  // Creating an array of keys fron an array of objects
  const keysArrayFromArray = (array) => {
    let keysArray = [];
    for (let i = 0; i < array.length; i++) {
      keysArray.push(Object.keys(array[i]));
    }

    return keysArray;
  };

  // Creating an array of values fron an array of objects
  const valuesArrayFromArray = (array) => {
    let valuesArray = [];
    for (let i = 0; i < array.length; i++) {
      valuesArray.push(Object.values(array[i]));
    }
    return valuesArray;
  };

  // Creating an array of keys from an object
  const keysArrayFromObject = (obj) => {
    return Object.keys(obj);
  };

  // Creating an array of values from an object
  const valuesArrayFromObject = (obj) => {
    return Object.values(obj);
  };

  let idOfCandidate = candidate._id;
  console.log("idOfCandidate", idOfCandidate);

  let arrayOfKeysOfCandidate = keysArrayFromObject(candidate);
  let arrayOfValuesOfCandidate = valuesArrayFromObject(candidate);

  let arrayOfKeysOfArray = keysArrayFromArray(array);
  let arrayOfValuesOfArray = valuesArrayFromArray(array);

  console.log("arrayOfKeysOfCandidate", arrayOfKeysOfCandidate);
  console.log("arrayOfKeysOfCandidate.length", arrayOfKeysOfCandidate.length);
  console.log("arrayOfValuesOfArray", arrayOfValuesOfArray);
  console.log("arrayOfValuesOfCandidate", arrayOfValuesOfCandidate);

  /////////////////////////////////////////////////////////////////////////////////////
  //   Finding the index of each targeted object key within the array of keys
  let indexFoundForId;
  let indexElementFoundForId;
  let indexesOfValuesToCheckFromKeysFoundForId = [];

  for (let i = 0; i < arrayOfKeysOfArray.length; i++) {
    for (let j = 0; j < arrayOfKeysOfArray[i].length; j++) {
      if (arrayOfKeysOfArray[i][j] === "_id") {
        indexFoundForId = i;
        indexElementFoundForId = j;
        indexesOfValuesToCheckFromKeysFoundForId.push([
          indexFoundForId,
          indexElementFoundForId,
        ]);
      }
    }
  }
  // console.log(
  //   "indexesOfValuesToCheckFromKeysFoundForId",
  //   indexesOfValuesToCheckFromKeysFoundForId
  // );
  let idFound = 0;
  for (let i = 0; i < indexesOfValuesToCheckFromKeysFoundForId.length; i++) {
    if (
      arrayOfValuesOfArray[indexesOfValuesToCheckFromKeysFoundForId[i][0]][
        indexesOfValuesToCheckFromKeysFoundForId[i][1]
      ] === idOfCandidate
    ) {
      console.log("Duplicate found");
      idFound++;
    }
  }
  if (idFound > 0) {
    return true;
  } else {
    return false;
  }
};
