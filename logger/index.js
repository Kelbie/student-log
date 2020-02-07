import chalk from 'chalk';

export default (name, args, req, color) => {
  let message = `< ${name}(${args ? JSON.stringify(args) : ''})`;
  console.log(chalk[color](message), req.user ? req.user.displayName : 'Unknown');
};
