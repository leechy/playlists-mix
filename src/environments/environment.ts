// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// TODO: put the client id in the more secure place
export const environment = {
  production: false,
  baseURL: 'https://api.jamendo.com/v3.0',
  clientId: 'cf4e0880'
};
