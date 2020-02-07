import chalk from 'chalk';

export default (type, name, args, req, color) => {
  let message = `${type} ${name}(${args ? JSON.stringify(args) : ''})`;
  console.log(chalk[color](message), req.user ? req.user.displayName : 'Unknown');
};
