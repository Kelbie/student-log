var Twitter = require('twitter');

export function grad_tweet_template(url, name, title, type, category, location) {
  const client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  });

  if (type !== 'full-time') {
    return;
  }

  const category_hashtags = function() {
    switch (category) {
      case 'programming':
        return '#programming';
      case 'design':
        return '';
      case 'customer support':
        return '';
      case 'copywriting':
        return '';
      case 'devops & sysadmin':
        return '';
      case 'sales & marketing':
        return '';
      case 'business & management':
        return '';
      case 'finance & legal':
        return '';
      case 'product':
        return '';
      case 'administrative':
        return '';
      case 'education':
        return '';
      case 'translate & transcription':
        return '';
      case 'medical/health':
        return '';
      case 'other':
        return '';
    }
  };

  client.post(
    'statuses/update',
    {
      status: `
🎓: New Graduate Job! ${url} ${name} - ${title}
🌎: ${location}

#graduate #grad #gradjobs #graduatejobs
`
    },
    function(error, tweet, response) {
      if (error) throw error;
      console.log(tweet); // Tweet body.
      console.log(response); // Raw response object.
    }
  );
}
