import requests
import time
import datetime

def eth(tsyms):
   qs = { 'fsym': 'ETH', 'tsyms': tsyms.replace(' ', '').upper(), 'sign': True }
   r = requests.get('https://min-api.cryptocompare.com/data/price', params = qs)

   result = { 'data': r.json() }

   if 'Authorization' not in r.headers:
      return None

   sig = r.headers['Authorization'][len('Signature '):]

   for t in sig.split(','):
      val = t.split('"')
      result[val[0][:-1]] = val[1]

   result['timestamp'] = int(time.time())

   return result

if __name__ == '__main__':
   result = eth('sgd ,thb   ,myr')
   for i in result:
      print('%s = %s' %(i, str(result[i])))
