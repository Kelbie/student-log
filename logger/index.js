import chalk from 'chalk';

// pretty log messages with specific format
export default (type, name, args, req, color) => {
  let message = `${type} ${name}(${args ? JSON.stringify(args) : ''})`;
  console.log(chalk[color](message), req.user ? req.user.displayName : 'Unknown');
};
