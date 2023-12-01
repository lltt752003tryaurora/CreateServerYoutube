// format lại data cho chuẩn đầu ra

export const responseData = (res, message, data, statusCode) => {
  res.status(statusCode).json({
    message,
    content: data,
    date: new Date(),
  });
};
