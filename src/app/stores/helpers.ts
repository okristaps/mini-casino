function findKeyWithLargestValue(obj: any) {
  let largestKey = null;
  let largestValue = -Infinity;

  for (const key in obj) {
    if (obj[key] > largestValue) {
      largestKey = key;
      largestValue = obj[key];
    }
  }

  return largestKey;
}

export { findKeyWithLargestValue };
