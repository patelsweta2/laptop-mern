export default async function (model, schema, indexObj, options) {
  const indexList = await model.collection.indexes();
  // if index already exist do not create it
  for (let value of indexList) {
    if (deepEqual(value.key, indexObj))
      return console.log(`Not creating index for {${Object.keys(indexObj)}}`);
  }
  if (options) {
    schema.index(indexObj, options);
    console.log(`Index is created with ttl`);
  } else {
    schema.index(indexObj);
    console.log(`Index is created`);
  }
}

// checking deepEquality
function deepEqual(obj1, obj2) {
  // Check if both are the same reference
  if (obj1 === obj2) return true;

  // Check if both are objects (and not null)
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  // Get keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is different
  if (keys1.length !== keys2.length) return false;

  // Recursively check each property
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
