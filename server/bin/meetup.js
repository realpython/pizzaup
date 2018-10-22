const axios = require('axios');
const { URL } = require('url');

const meetupValid = async ({
	url, token
}) =>
{
	let validResponse = {
		valid: false,
		message: "Meetup not verified"
	};

	const testUrl = new URL(url);

	try
	{
		const axiosOptions =
		{
			url: `https://api.meetup.com/${testUrl.pathname}?fields=name,venue&key=${token}`,
			method: "get"
		};

		const result = await axios(axiosOptions);

		validResponse =
		{
			valid: true,
            message: `Meetup name: ${result.data.name}`,
            venue: result.data.venue
		};
	}
	catch (err)
	{
		if (err.response.status === 404)
		{
			validResponse.message = "Meetup event not found.";
		}
		else if (err.response.status === 410)
		{
			validResponse.message = "Meetup previously deleted";
		}
		else if (err.response.status === 403)
		{
			validResponse.message = "Meetup access forbidden - possibly you are unauthorized to view and/or meetup is still a draft";
		} else {
            validResponse.message = `${err.response.status} - ${err.response.statusText}`;
        }
	}

	return validResponse;
};

module.exports = meetupValid;
