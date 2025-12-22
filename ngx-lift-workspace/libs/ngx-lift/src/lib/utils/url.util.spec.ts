import {isFQDN, isHttps, isIP, isURL} from './url.util';

describe('isIP', () => {
  it('should return true for valid IPv4 addresses', () => {
    expect(isIP(new URL('https://192.168.1.1:443').hostname)).toBe(true);
    expect(isIP('192.168.1.1')).toBe(true);
    expect(isIP('255.255.255.255')).toBe(true);
    expect(isIP('127.0.0.1')).toBe(true);
  });

  it('should return false for invalid IPv4 addresses', () => {
    expect(isIP('256.256.256.256')).toBe(false);
    expect(isIP('192.168.1')).toBe(false);
    expect(isIP('192.168.1.1.1')).toBe(false);
    expect(isIP('192.168.1:443')).toBe(false);
  });
});

describe('isFQDN', () => {
  it('should return true for valid FQDNs', () => {
    expect(isFQDN(new URL('https://example.com:443').hostname)).toBe(true);
    expect(isFQDN('example.com')).toBe(true);
    expect(isFQDN('www.example.com')).toBe(true);
    expect(isFQDN('subdomain.example.co.uk')).toBe(true);
  });

  it('should return false for invalid FQDNs', () => {
    expect(isFQDN('example')).toBe(false);
    expect(isFQDN('example.com.')).toBe(false);
    expect(isFQDN('www.example-.com')).toBe(false);
    expect(isFQDN('-www.example.com')).toBe(false);
    expect(isFQDN('www..example.com')).toBe(false);
    expect(isFQDN('www.example.com-')).toBe(false);
  });
});

describe('isURL', () => {
  it('should return true for valid URLs', () => {
    expect(isURL('https://example.com')).toBe(true);
    expect(isURL('http://example.com')).toBe(true);
    expect(isURL('https://www.example.com')).toBe(true);
    expect(isURL('http://www.example.com')).toBe(true);
    expect(isURL('https://example.com/path')).toBe(true);
    expect(isURL('https://example.com:8080/path')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isURL('example.com')).toBe(false);
    expect(isURL('http://')).toBe(false);
    expect(isURL('https://')).toBe(false);
    expect(isURL('https://example')).toBe(false);
    expect(isURL('ftp://example.com')).toBe(false);
  });
});

describe('isHttps', () => {
  it('should return true for URLs starting with https://', () => {
    expect(isHttps('https://example.com')).toBe(true);
    expect(isHttps('https://www.example.com')).toBe(true);
    expect(isHttps('https://example.com/path')).toBe(true);
    expect(isHttps('https://example.com:8080/path')).toBe(true);
  });

  it('should return false for URLs not starting with https://', () => {
    expect(isHttps('http://example.com')).toBe(false);
    expect(isHttps('example.com')).toBe(false);
    expect(isHttps('https:/example.com')).toBe(false);
    expect(isHttps('https://')).toBe(false);
    expect(isHttps('https:/example.com')).toBe(false);
    expect(isHttps('https:/example.com:8080/path')).toBe(false);
    expect(isHttps('ftp://example.com')).toBe(false);
  });
});
