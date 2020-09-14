export const handleRequestError = data => {
  const code = Number(data.code) || 200;
  if (code !== 200 && code !== 202 && code !== 201) {
    throw data;
  }
};
export default handleRequestError;

export const ixHandleRequestError = data => {
  const res = {};
  res.code = data.ret;
  if (res.code !== 0) {
    throw res;
  }
};
