exports.handler = async (event, context) => {
	const name = event?.name || "World";

	return {
		statusCode: 200,
		body: `Hello ${name}`,
	};
};
