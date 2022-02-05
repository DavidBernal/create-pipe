module.exports = async function* pipe(stream, isPiped, params) {
  for await (let chunk /* buffer */ of stream) {
    // YOUR CODE HERE
    yield chunk;
  }
};
