import * as crypto from 'crypto';
import { TRANSACTION_SEPARATOR } from './constants';
import Transaction from './transaction';

// Trim "BEGIN/END PUBLIC KEY" message from PEM keys.
export function prettyPrintPem (key: string): string {
  return key.slice(27, -26);
}

export function printBCCoinWelcomeMessage (): void {
  console.log(TRANSACTION_SEPARATOR);
  console.log('\t  🔥        Welcome to BC COIN!        🔥\n');
  console.log('\t  🔥   Buy BC COIN if you like BC! 😋  🔥\n');
  console.log('\t  🔥         Have a great day!         🔥\n');
  console.log(TRANSACTION_SEPARATOR);
}

export function getRSAKeyPair (): crypto.KeyPairSyncResult<string, string> {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 512,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
}

export function getSignatureForTransaction (
  transaction: Transaction,
  privateKey: string,
): Buffer {
  const unsigned = crypto.createSign('SHA256');
  unsigned.update(transaction.toString()).end();

  return unsigned.sign(privateKey);
}
