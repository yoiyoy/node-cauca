import co from 'co';

// array를 비동기지만 순차적으로 map을 수행함
// coFunc는 yieldable을 반환 하는 함수
export default (array, coFunc) => co(function* () {
  const resultArray = [];
  const len = array.length;
  for (let i = 0; i < len; i += 1) {
    const result = yield coFunc(array[i], i, array);
    resultArray.push(result);
  }
  return resultArray;
});
