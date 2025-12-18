import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const region = process.env.AWS_REGION;
const clientId = process.env.COGNITO_CLIENT_ID;

if (!region || !clientId) {
  throw new Error('AWS_REGION and COGNITO_CLIENT_ID must be set for Cognito auth');
}

export const cognitoClient = new CognitoIdentityProviderClient({
  region,
});

export const validateCsufEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!email.toLowerCase().endsWith('@csu.fullerton.edu')) {
    return 'A valid csu.fullerton.edu email is required.';
  }
  return null;
};

export const validateCognitoPassword = (password: string) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include an uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include a lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include a digit.';
  }
  return null;
};

const formatCognitoError = (err: unknown) => {
  if (err && typeof err === 'object' && 'name' in err && 'message' in err) {
    return `${String((err as any).name)}: ${String((err as any).message)}`;
  }
  return 'Unexpected Cognito error';
};

export const registerCsufUser = async (email: string, password: string, fullName?: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  const pwError = validateCognitoPassword(password);
  if (pwError) {
    throw new Error(pwError);
  }

  try {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        ...(fullName ? [{ Name: 'name', Value: fullName }] : []),
      ],
    });

    const response = await cognitoClient.send(command);
    return {
      message: response.UserConfirmed
        ? 'User created'
        : 'A verification code was sent to your email.',
    };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};

export const loginCsufUser = async (email: string, password: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  const pwError = validateCognitoPassword(password);
  if (pwError) {
    throw new Error(pwError);
  }

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    const tokens = response.AuthenticationResult || {};

    return {
      user: { email },
      tokens: {
        accessToken: tokens.AccessToken,
        refreshToken: tokens.RefreshToken,
        idToken: tokens.IdToken,
        expiresIn: tokens.ExpiresIn,
        tokenType: tokens.TokenType,
      },
    };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};

export const confirmCsufSignup = async (email: string, code: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }
  if (!code || !code.trim()) {
    throw new Error('Verification code is required.');
  }

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code.trim(),
    });

    await cognitoClient.send(command);
    return { message: 'Account verified.' };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};

export const resendCsufConfirmation = async (email: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: clientId,
      Username: email,
    });

    await cognitoClient.send(command);
    return { message: 'Verification code resent.' };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};

export const startCsufPasswordReset = async (email: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }

  try {
    const command = new ForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
    });

    await cognitoClient.send(command);
    return { message: 'Password reset code sent.' };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};

export const confirmCsufPasswordReset = async (email: string, code: string, newPassword: string) => {
  const emailError = validateCsufEmail(email);
  if (emailError) {
    throw new Error(emailError);
  }
  if (!code || !code.trim()) {
    throw new Error('Verification code is required.');
  }

  const pwError = validateCognitoPassword(newPassword);
  if (pwError) {
    throw new Error(pwError);
  }

  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code.trim(),
      Password: newPassword,
    });

    await cognitoClient.send(command);
    return { message: 'Password reset successfully.' };
  } catch (err) {
    throw new Error(formatCognitoError(err));
  }
};
