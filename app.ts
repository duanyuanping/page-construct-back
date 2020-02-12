module.exports = app => {
	app.beforeStart(async () => {
		console.log('/-***************-/');
		console.log('服务启动成功');
		console.log('/-***************-/');
	});
};
