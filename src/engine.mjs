// 从 main 的页面与订阅函数拆出；每次调用的配置相互隔离。
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { buildSingboxConfig, normalizeNodeNames } from './singbox.mjs';
export function createSubscriptionEngine(config, uuid) {
const 基础64文本解码器 = new TextDecoder();

function 解码64(文本) {
  const 二进制 = atob(文本);
  const 字节 = new Uint8Array(二进制.length);
  for (let 索引 = 0; 索引 < 二进制.length; 索引++) 字节[索引] = 二进制.charCodeAt(索引);
  return 基础64文本解码器.decode(字节);
}

let 认证令牌 = '351c9981-04b6-4103-aa4b-864aa9c91469';

let 回退地址 = '';

let 代理5配置 = '';

let 自定义优选地址列表 = [];

let 自定义优选域名列表 = [];

let 启用代理降级 = false;

let 仅走代理 = false;

let 禁用非传输层安全 = false;

let 禁用优选 = false;

let 启用地区匹配 = true;

let 当前工作器地区 = '';

let 手动工作器地区 = '';

let 优选地址源 = '';

let 自定义路径 = '';

let 启用明文 = true;

let 启用木马 = false;

let 启用扩展传输 = false;

let 传输路径 = '';

let 启用加密客户端问候 = false;

let 自定义域名系统 = 'https://223.5.5.5/dns-query';

let 自定义加密客户端问候域名 = 'cloudflare-ech.com';

let 自定义应用层协议协商 = '';

let 订阅转换接口 = 解码64('aHR0cHM6Ly91cmwudjEubWsvc3Vi');

const 远程配置网址 = 'https://raw.githubusercontent.com/byJoey/test/refs/heads/main/tist.ini';

let 启用优选域名 = true;

let 启用优选地址 = true;

let 启用仓库优选 = true;

let 启用原生地址 = false;

let 启用家宽链式 = false;

let 键值配置 = {};

const supportsFreeCpu = Object.hasOwn(config, 'freeCpu');
const 配置默认值 = {
  freeCpu: 'no',
  wk: '',
  ev: 'yes',
  et: 'no',
  ex: 'no',
  ech: 'no',
  tp: '',
  customDNS: 'https://223.5.5.5/dns-query',
  customECHDomain: 'cloudflare-ech.com',
  alpn: '',
  d: '',
  p: '',
  yx: '',
  yxURL: '',
  s: '',
  homepage: '',
  scu: 解码64('aHR0cHM6Ly91cmwudjEubWsvc3Vi'),
  ena: 'no',
  epd: 'yes',
  epi: 'yes',
  egi: 'yes',
  ae: '',
  rm: '',
  qj: '',
  dkby: 'no',
  yxby: '',
  ipv4: 'yes',
  ipv6: 'yes',
  ispMobile: 'yes',
  ispUnicom: 'yes',
  ispTelecom: 'yes',
  jk: 'no'
};

function 是否开启值(值, 默认启用 = false) {
  if (值 === undefined || 值 === null || 值 === '') return 默认启用;
  if (值 === true || 值 === false) return 值;
  const 文本 = String(值).trim().toLowerCase();
  if (文本 === 'yes' || 文本 === 'true' || 文本 === '1' || 文本 === 'on') return true;
  if (文本 === 'no' || 文本 === 'false' || 文本 === '0' || 文本 === 'off') return false;
  return 默认启用;
}

function 归一配置开关(值, 默认启用 = false) {
  return 是否开启值(值, 默认启用) ? 'yes' : 'no';
}

function 整理有效配置(配置) {
  const 快照 = {
    ...配置默认值,
    ...配置
  };
  ['freeCpu', 'ev', 'et', 'ex', 'ech', 'ena', 'epd', 'epi', 'egi', 'ipv4', 'ipv6', 'ispMobile', 'ispUnicom', 'ispTelecom', 'jk'].forEach(键 => {
    快照[键] = 归一配置开关(快照[键], 是否开启值(配置默认值[键]));
  });
  if (快照.ev === 'no' && 快照.et === 'no' && 快照.ex === 'no') {
    快照.ev = 'yes';
  }
  if (快照.ech === 'yes') {
    快照.dkby = 'yes';
  }
  return 快照;
}

function 读取环境配置值(环境值, ...名称列表) {
  if (!环境值) return undefined;
  for (const 名称 of 名称列表) {
    if (环境值[名称] !== undefined && 环境值[名称] !== null && 环境值[名称] !== '') {
      return 环境值[名称];
    }
  }
  return undefined;
}

function 获取环境配置快照(环境值 = {}) {
  const 映射 = {
    freeCpu: ['freeCpu', 'FREE_CPU'],
    wk: ['wk', 'WK'],
    ev: ['ev', 'EV'],
    et: ['et', 'ET'],
    ex: ['ex', 'EX'],
    ech: ['ech', 'ECH'],
    tp: ['tp', 'TP'],
    customDNS: ['customDNS', 'CUSTOMDNS', 'CUSTOM_DNS'],
    customECHDomain: ['customECHDomain', 'CUSTOMECHDOMAIN', 'CUSTOM_ECH_DOMAIN'],
    alpn: ['alpn', 'ALPN'],
    d: ['d', 'D'],
    p: ['p', 'P'],
    yx: ['yx', 'YX'],
    yxURL: ['yxURL', 'YXURL', 'YX_URL'],
    s: ['s', 'S'],
    homepage: ['homepage', 'HOMEPAGE'],
    scu: ['scu', 'SCU'],
    ena: ['ena', 'ENA'],
    epd: ['epd', 'EPD'],
    epi: ['epi', 'EPI'],
    egi: ['egi', 'EGI'],
    ae: ['ae', 'AE'],
    rm: ['rm', 'RM'],
    qj: ['qj', 'QJ'],
    dkby: ['dkby', 'DKBY'],
    yxby: ['yxby', 'YXBY'],
    ipv4: ['ipv4', 'IPV4'],
    ipv6: ['ipv6', 'IPV6'],
    ispMobile: ['ispMobile', 'ISPMOBILE', 'ISP_MOBILE'],
    ispUnicom: ['ispUnicom', 'ISPUNICOM', 'ISP_UNICOM'],
    ispTelecom: ['ispTelecom', 'ISPTELECOM', 'ISP_TELECOM'],
    jk: ['jk', 'JK']
  };
  const 快照 = {};
  for (const [键, 名称列表] of Object.entries(映射)) {
    const 值 = 读取环境配置值(环境值, ...名称列表);
    if (值 !== undefined) 快照[键] = 值;
  }
  return 快照;
}

function 获取有效配置快照(环境值 = {}) {
  return 整理有效配置({
    ...获取环境配置快照(环境值),
    ...键值配置
  });
}

const 官方直连地址 = ['pp.xy.kg'];

function 取官方直连地址() {
  const 命中 = 官方直连地址[Math.floor(Math.random() * 官方直连地址.length)];
  return {
    domain: 命中,
    region: 'CF',
    regionCode: 'CF',
    port: 443
  };
}

let 备用地址列表 = [{
  domain: 解码64('UHJveHlJUC5ISy5DTUxpdXNzc3MubmV0'),
  region: 'HK',
  regionCode: 'HK',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5VUy5DTUxpdXNzc3MubmV0'),
  region: 'US',
  regionCode: 'US',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5TRy5DTUxpdXNzc3MubmV0'),
  region: 'SG',
  regionCode: 'SG',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5KUC5DTUxpdXNzc3MubmV0'),
  region: 'JP',
  regionCode: 'JP',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5LUi5DTUxpdXNzc3MubmV0'),
  region: 'KR',
  regionCode: 'KR',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5ERS5DTUxpdXNzc3MubmV0'),
  region: 'DE',
  regionCode: 'DE',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5TRS5DTUxpdXNzc3MubmV0'),
  region: 'SE',
  regionCode: 'SE',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5OTC5DTUxpdXNzc3MubmV0'),
  region: 'NL',
  regionCode: 'NL',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5GSS5DTUxpdXNzc3MubmV0'),
  region: 'FI',
  regionCode: 'FI',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5HQi5DTUxpdXNzc3MubmV0'),
  region: 'GB',
  regionCode: 'GB',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5PcmFjbGUuY21saXVzc3NzLm5ldA=='),
  region: 'Oracle',
  regionCode: 'Oracle',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5EaWdpdGFsT2NlYW4uQ01MaXVzc3NzLm5ldA=='),
  region: 'DigitalOcean',
  regionCode: 'DigitalOcean',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5WdWx0ci5DTUxpdXNzc3MubmV0'),
  region: 'Vultr',
  regionCode: 'Vultr',
  port: 443
}, {
  domain: 解码64('UHJveHlJUC5NdWx0YWNvbS5DTUxpdXNzc3MubmV0'),
  region: 'Multacom',
  regionCode: 'Multacom',
  port: 443
}];

const 直连域名列表 = [{
  name: "cloudflare.182682.xyz",
  domain: "cloudflare.182682.xyz"
}, {
  name: "speed.marisalnc.com",
  domain: "speed.marisalnc.com"
}, {
  domain: "freeyx.cloudflare88.eu.org"
}, {
  domain: "bestcf.top"
}, {
  domain: "cdn.2020111.xyz"
}, {
  domain: "cfip.cfcdn.vip"
}, {
  domain: "cf.0sm.com"
}, {
  domain: "cf.090227.xyz"
}, {
  domain: "cf.zhetengsha.eu.org"
}, {
  domain: "cloudflare.9jy.cc"
}, {
  domain: "cf.zerone-cdn.pp.ua"
}, {
  domain: "cfip.1323123.xyz"
}, {
  domain: "cnamefuckxxs.yuchen.icu"
}, {
  domain: "cloudflare-ip.mofashi.ltd"
}, {
  domain: "115155.xyz"
}, {
  domain: "cname.xirancdn.us"
}, {
  domain: "f3058171cad.002404.xyz"
}, {
  domain: "8.889288.xyz"
}, {
  domain: "cdn.tzpro.xyz"
}, {
  domain: "cf.877771.xyz"
}, {
  domain: "xn--b6gac.eu.org"
}];

const 错误_无效代理地址 = atob('SW52YWxpZCBTT0NLUyBhZGRyZXNzIGZvcm1hdA==');

const 前缀_套接字5 = atob('c29ja3M1Oi8v');

const 前缀_套接字 = atob('c29ja3M6Ly8=');

const 前缀_超文本 = atob('aHR0cDovLw==');

const 前缀_安全超文本 = atob('aHR0cHM6Ly8=');

const 代理种类_套接字5 = 'p5';

const 代理种类_隧道 = 'pt';

const 代理种类_安全隧道 = 'pts';

let 已解析代理5配置 = {};

let 是否代理已启用 = false;

function 是否有效地址(地址792) {
  return isIP(地址792) !== 0;
}

function 规范化节点主机(主机786) {
  return String(主机786 || '').trim().replace(/^\[([^\]]+)\]$/, '$1');
}

function 处理值节点别名部分(值785, 回退 = 'Node') {
  let 文本784 = String(值785 || '').trim();
  if (!文本784 || /^自定义优选-/i.test(文本784)) 文本784 = 回退;
  文本784 = 文本784.replace(/^\[([^\]]+)\]$/, '$1').replace(/^https?:\/\//i, '').replace(/[/?#].*$/, '').replace(/\s+/g, '_');
  return 文本784 || 回退;
}

function 获取值节点别名基础(项目783) {
  const 主机782 = 规范化节点主机(项目783?.ip || 项目783?.domain || '');
  if (主机782 && 主机782.includes(':') && /^[0-9a-fA-F:.]+$/.test(主机782)) {
    return 处理值节点别名部分(项目783?.isp || 项目783?.name || '', 'IPv6优选');
  }
  if (主机782 && !是否有效地址(主机782)) return '优选域名';
  const 本地值781 = 处理值节点别名部分(项目783?.isp || 项目783?.name || '', 'IPv4优选');
  const 机房780 = 处理值节点别名部分(项目783?.colo || '', '');
  return 机房780 ? `${本地值781}-${机房780}` : 本地值781;
}

function 创建值节点命名器(跳过编号779 = false) {
  const 计数器组 = {};
  return 项目778 => {
    const 基础 = 获取值节点别名基础(项目778);
    if (跳过编号779) return 基础;
    计数器组[基础] = (计数器组[基础] || 0) + 1;
    return `${基础}-${String(计数器组[基础]).padStart(2, '0')}`;
  };
}

function 规范化应用层协议协商(值777) {
  const 本地值776 = ['', 'h3', 'h2', 'http/1.1', 'h3,h2', 'h2,http/1.1', 'h3,h2,http/1.1'];
  const 应用层协议协商775 = String(值777 || '').trim();
  return 本地值776.includes(应用层协议协商775) ? 应用层协议协商775 : '';
}

function 处理值应用层协议协商值(参数774) {
  const 应用层协议协商 = 规范化应用层协议协商(自定义应用层协议协商);
  if (应用层协议协商) 参数774.set('alpn', 应用层协议协商);
}

function 获取配置值(键765, 默认值 = '') {
  if (键值配置[键765] !== undefined) {
    return 键值配置[键765];
  }
  return 默认值;
}

async function 获取值备用地址(工作器地区753 = '', 值地区匹配752 = 启用地区匹配) {
  // wk 留空时走官方直连域名，手填 p 仍优先。
  if (!工作器地区753 || 工作器地区753 === 'CF') {
    return 取官方直连地址();
  }
  if (备用地址列表.length === 0) {
    return 取官方直连地址();
  }
  const 可用地址列表751 = 备用地址列表.map(地址750 => ({
    ...地址750,
    available: true
  }));
  if (值地区匹配752 && 工作器地区753) {
    const 值地址列表749 = 获取值地区值(工作器地区753, 可用地址列表751, 值地区匹配752);
    if (值地址列表749.length > 0) {
      const 已选地址748 = 值地址列表749[0];
      return 已选地址748;
    }
  }
  const 已选地址 = 可用地址列表751[0];
  return 已选地址;
}

function 获取值值(地区747) {
  const 值映射 = {
    'US': ['SG', 'JP', 'KR'],
    'SG': ['JP', 'KR', 'US'],
    'JP': ['SG', 'KR', 'US'],
    'KR': ['JP', 'SG', 'US'],
    'DE': ['NL', 'GB', 'SE', 'FI'],
    'SE': ['DE', 'NL', 'FI', 'GB'],
    'NL': ['DE', 'GB', 'SE', 'FI'],
    'FI': ['SE', 'DE', 'NL', 'GB'],
    'GB': ['DE', 'NL', 'SE', 'FI']
  };
  return 值映射[地区747] || [];
}

function 获取值值值值(地区746) {
  const 值值745 = 获取值值(地区746);
  const 值值744 = ['US', 'SG', 'JP', 'KR', 'DE', 'SE', 'NL', 'FI', 'GB'];
  return [地区746, ...值值745, ...值值744.filter(结果值743 => 结果值743 !== 地区746 && !值值745.includes(结果值743))];
}

function 获取值地区值(工作器地区, 可用地址列表, 值地区匹配 = 启用地区匹配) {
  if (!值地区匹配 || !工作器地区) {
    return 可用地址列表;
  }
  const 值值742 = 获取值值值值(工作器地区);
  const 值地址列表741 = [];
  for (const 地区 of 值值742) {
    const 地区地址列表 = 可用地址列表.filter(地址740 => 地址740.regionCode === 地区);
    值地址列表741.push(...地区地址列表);
  }
  return 值地址列表741;
}

function 解析地址值端口(输入) {
  if (输入.includes('[') && 输入.includes(']')) {
    const 本地值739 = 输入.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (本地值739) {
      return {
        address: 本地值739[1],
        port: 本地值739[2] ? parseInt(本地值739[2], 10) : null
      };
    }
  }
  const 值值索引738 = 输入.lastIndexOf(':');
  if (值值索引738 > 0) {
    const 地址737 = 输入.substring(0, 值值索引738);
    const 端口字符串 = 输入.substring(值值索引738 + 1);
    const 端口736 = parseInt(端口字符串, 10);

    // address 含 ':' 说明是裸 IPv6（如 2001:db8::1），整体当地址，无端口
    if (!地址737.includes(':') && !isNaN(端口736) && 端口736 > 0 && 端口736 <= 65535) {
      return {
        address: 地址737,
        port: 端口736
      };
    }
  }
  return {
    address: 输入,
    port: null
  };
}

function 处理本地值622(取值621) {
  if (取值621 == null) return '""';
  const 字符串值620 = String(取值621);
  return '"' + 字符串值620.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function 规范化值主机(主机名619) {
  if (!主机名619) return 主机名619;
  const 头值618 = String(主机名619);
  if (头值618.startsWith('[') && 头值618.endsWith(']')) return 头值618.slice(1, -1);
  return 头值618;
}

function 处理值选择值(名称列表617, 本地值616 = {}) {
  const {
    directFirst: 直连首次615 = false,
    extraGroups: 值值614 = []
  } = 本地值616;
  const 节点行列表 = 名称列表617.length ? 名称列表617.map(数量值613 => `      - ${处理本地值622(数量值613)}`).join('\n') : '      - DIRECT';
  const 行列表612 = [];
  if (直连首次615) {
    行列表612.push('      - "🎯 全球直连"', '      - "🚀 节点选择"');
  } else {
    行列表612.push('      - "🚀 节点选择"', '      - "🎯 全球直连"');
  }
  for (const 本地值611 of 值值614) 行列表612.push(`      - ${处理本地值622(本地值611)}`);
  行列表612.push(节点行列表);
  return 行列表612.join('\n');
}

function 处理值值列表(名称列表610, 本地值609 = {}) {
  const {
    directFirst: 直连首次 = false,
    extraGroups: 值值608 = [],
    compact: 本地值607 = false
  } = 本地值609;
  const 本地值606 = 本地值607 ? ',' : ', ';
  const 列表605 = 名称列表610.length ? 名称列表610.join(本地值606) : 'DIRECT';
  const 部分列表604 = [];
  if (直连首次) 部分列表604.push('🎯 全球直连', '🚀 节点选择');else 部分列表604.push('🚀 节点选择', '🎯 全球直连');
  部分列表604.push(...值值608);
  if (名称列表610.length) 部分列表604.push(列表605);
  return 部分列表604.join(本地值606);
}

function 解析值链接(链接603) {
  try {
    if (链接603.startsWith(解码64('dmxlc3M6Ly8='))) {
      const 网址602 = new URL(链接603);
      const 参数值601 = new URLSearchParams(网址602.search);
      return {
        proto: 解码64('dmxlc3M='),
        name: decodeURIComponent(网址602.hash.substring(1)) || 网址602.hostname + ':' + 网址602.port,
        uuid: 网址602.username,
        server: 规范化值主机(网址602.hostname),
        port: parseInt(网址602.port) || 443,
        tls: 参数值601.get('security') === 'tls' || 参数值601.get('security') === 解码64('cmVhbGl0eQ=='),
        network: 参数值601.get('type') || 'ws',
        path: 参数值601.get('path') || '/?ed=2048',
        host: 规范化值主机(参数值601.get('host') || 网址602.hostname),
        sni: 规范化值主机(参数值601.get('sni') || 参数值601.get('host') || 网址602.hostname),
        alpn: (参数值601.get('alpn') || '').split(',').map(字符串值600 => 字符串值600.trim()).filter(Boolean),
        fp: 参数值601.get('fp') || 'chrome',
        flow: 参数值601.get('flow') || '',
        encryption: 参数值601.get('encryption') || 'none',
        mode: 参数值601.get('mode') || '',
        ech: 参数值601.get('ech') || ''
      };
    }
    if (链接603.startsWith(解码64('dHJvamFuOi8v'))) {
      const 网址599 = new URL(链接603);
      const 参数值 = new URLSearchParams(网址599.search);
      return {
        proto: 解码64('dHJvamFu'),
        name: decodeURIComponent(网址599.hash.substring(1)) || 网址599.hostname + ':' + 网址599.port,
        password: decodeURIComponent(网址599.username),
        security: 参数值.get('security') || 'tls',
        server: 规范化值主机(网址599.hostname),
        port: parseInt(网址599.port) || 443,
        tls: true,
        network: 参数值.get('type') || 'ws',
        path: 参数值.get('path') || '/?ed=2048',
        host: 规范化值主机(参数值.get('host') || 网址599.hostname),
        sni: 规范化值主机(参数值.get('sni') || 参数值.get('host') || 网址599.hostname),
        alpn: (参数值.get('alpn') || '').split(',').map(字符串值598 => 字符串值598.trim()).filter(Boolean),
        fp: 参数值.get('fp') || 'chrome',
        ech: 参数值.get('ech') || ''
      };
    }
  } catch (事件值597) {}
  return null;
}

function 构建值节点行(数量值596) {
  const 行列表595 = [];
  const 本地值594 = 规范化值主机(数量值596.server);
  const 主机593 = 规范化值主机(数量值596.host) || 本地值594;
  const 服务名称指示592 = 规范化值主机(数量值596.sni) || 主机593;
  行列表595.push(`  - name: ${处理本地值622(数量值596.name)}`);
  行列表595.push(`    type: ${数量值596.proto}`);
  行列表595.push(`    server: ${处理本地值622(本地值594)}`);
  行列表595.push(`    port: ${数量值596.port}`);
  if (数量值596.proto === 解码64('dmxlc3M=')) {
    行列表595.push(`    uuid: ${数量值596.uuid}`);
    行列表595.push(`    udp: true`);
    行列表595.push(`    tls: ${数量值596.tls ? 'true' : 'false'}`);
    if (数量值596.flow) 行列表595.push(`    flow: ${处理本地值622(数量值596.flow)}`);
    行列表595.push(`    client-fingerprint: ${处理本地值622(数量值596.fp || 'chrome')}`);
  } else if (数量值596.proto === 解码64('dHJvamFu')) {
    行列表595.push(`    password: ${处理本地值622(数量值596.password)}`);
    行列表595.push(`    udp: true`);
  }
  if (数量值596.tls) {
    行列表595.push(`    sni: ${处理本地值622(服务名称指示592)}`);
    if (数量值596.alpn && 数量值596.alpn.length) {
      行列表595.push(`    alpn: [${数量值596.alpn.map(甲值591 => 处理本地值622(甲值591)).join(', ')}]`);
    }
    行列表595.push(`    skip-cert-verify: true`);
  }
  if (数量值596.network === 'ws' || 数量值596.network === 'xhttp') {
    行列表595.push(`    network: ws`);
    行列表595.push(`    ws-opts:`);
    行列表595.push(`      path: ${处理本地值622(数量值596.path)}`);
    行列表595.push(`      headers:`);
    行列表595.push(`        Host: ${处理本地值622(主机593)}`);
  } else if (数量值596.network === 'grpc') {
    行列表595.push(`    network: grpc`);
    行列表595.push(`    grpc-opts:`);
    行列表595.push(`      grpc-service-name: ${处理本地值622(数量值596.path)}`);
  }
  if (数量值596.ech) {
    const 加密客户端问候域名590 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
    行列表595.push(`    ech-opts:`);
    行列表595.push(`      enable: true`);
    行列表595.push(`      query-server-name: ${处理本地值622(加密客户端问候域名590)}`);
  }
  return 行列表595.join('\n');
}

function 生成值值589(链接列表588, 本地值587 = {}) {
  const 节点列表586 = normalizeNodeNames(链接列表588.map(解析值链接).filter(数量值585 => 数量值585 && (数量值585.proto === 解码64('dmxlc3M=') || 数量值585.proto === 解码64('dHJvamFu'))));
  const 名称列表584 = 节点列表586.map(数量值583 => 数量值583.name);
  const 域名系统值582 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
  const 头部581 = ['mixed-port: 7890', 'allow-lan: true', 'mode: rule', 'log-level: info', 'ipv6: true', 'external-controller: 127.0.0.1:9090', 'unified-delay: true', 'tcp-concurrent: true', 'geodata-mode: true', 'geo-auto-update: true', 'geo-update-interval: 24', 'geox-url:', '  geoip: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"', '  geosite: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat"', '  mmdb: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb"', '  asn: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"', 'sniffer:', '  enable: true', '  force-dns-mapping: true', '  parse-pure-ip: true', '  sniff:', '    HTTP:', '      ports: [80, 8080-8880]', '      override-destination: true', '    TLS:', '      ports: [443, 8443]', '    QUIC:', '      ports: [443, 8443]', 'dns:', '  enable: true', '  listen: 0.0.0.0:1053', '  ipv6: true', '  enhanced-mode: fake-ip', '  fake-ip-range: 198.18.0.1/16', '  fake-ip-filter:', '    - "*.lan"', '    - "+.local"', '    - "+.market.xiaomi.com"', '    - "+.msftconnecttest.com"', '    - "+.msftncsi.com"', '    - "localhost.ptlogin2.qq.com"', '    - "+.srv.nintendo.net"', '    - "+.stun.playstation.net"', '    - "+.xboxlive.com"', '  default-nameserver:', '    - 223.5.5.5', '    - 119.29.29.29', '  nameserver:', `    - ${域名系统值582}`, '    - https://119.29.29.29/dns-query', '  fallback:', '    - https://1.1.1.1/dns-query', '    - https://8.8.8.8/dns-query', '  fallback-filter:', '    geoip: true', '    geoip-code: CN', '    ipcidr:', '      - 240.0.0.0/4', ''];
  const 值值580 = ['proxies:'];
  for (const 数量值579 of 节点列表586) 值值580.push(构建值节点行(数量值579));
  const 节点仅 = 名称列表584.length ? 名称列表584.map(数量值578 => `      - ${处理本地值622(数量值578)}`).join('\n') : '      - DIRECT';
  const 值值577 = [解码64('cHJveHktZ3JvdXBzOg=='), '  - name: "🚀 节点选择"', '    type: select', '    proxies:', '      - "♻️ 自动选择"', '      - "🎯 全球直连"', 节点仅, '  - name: "♻️ 自动选择"', '    type: url-test', '    url: https://www.gstatic.com/generate_204', '    interval: 300', '    tolerance: 50', '    lazy: true', '    proxies:', 节点仅, '  - name: "🌍 国外媒体"', '    type: select', '    proxies:', 处理值选择值(名称列表584), '  - name: "📺 哔哩哔哩"', '    type: select', '    proxies:', 处理值选择值(名称列表584, {
    directFirst: true
  }), '  - name: "📹 油管视频"', '    type: select', '    proxies:', 处理值选择值(名称列表584, {
    extraGroups: ['🌍 国外媒体']
  }), '  - name: "🎬 奈飞视频"', '    type: select', '    proxies:', 处理值选择值(名称列表584, {
    extraGroups: ['🌍 国外媒体']
  }), '  - name: "📲 电报信息"', '    type: select', '    proxies:', 处理值选择值(名称列表584), '  - name: "🌐 谷歌服务"', '    type: select', '    proxies:', 处理值选择值(名称列表584), '  - name: "🤖 OpenAI"', '    type: select', '    proxies:', 处理值选择值(名称列表584), '  - name: "Ⓜ️ 微软服务"', '    type: select', '    proxies:', 处理值选择值(名称列表584, {
    directFirst: true
  }), '  - name: "🍎 苹果服务"', '    type: select', '    proxies:', 处理值选择值(名称列表584, {
    directFirst: true
  }), '  - name: "🎯 全球直连"', '    type: select', '    proxies:', '      - DIRECT', '  - name: "🛑 全球拦截"', '    type: select', '    proxies:', '      - REJECT', '      - DIRECT', '  - name: "🍃 应用净化"', '    type: select', '    proxies:', '      - REJECT', '      - DIRECT', '  - name: "🐟 漏网之鱼"', '    type: select', '    proxies:', 处理值选择值(名称列表584), ''];

  // 规则源 - CDN: jsDelivr
  const 值基础576 = 解码64('aHR0cHM6Ly9mYXN0bHkuanNkZWxpdnIubmV0L2doL0xveWFsc29sZGllci9jbGFzaC1ydWxlc0ByZWxlYXNl');
  const 提供器 = (名称575, 本地值574) => [`  ${名称575}:`, `    type: http`, `    behavior: ${本地值574}`, `    url: "${值基础576}/${名称575}.txt"`, `    path: ./rulesets/loyalsoldier/${名称575}.txt`, `    interval: 86400`].join('\n');
  const 规则值 = ['rule-providers:', 提供器('reject', 'domain'), 提供器('icloud', 'domain'), 提供器('apple', 'domain'), 提供器('google', 'domain'), 提供器(解码64('cHJveHk='), 'domain'), 提供器('direct', 'domain'), 提供器('private', 'domain'), 提供器('gfw', 'domain'), 提供器('greatfire', 'domain'), 提供器('tld-not-cn', 'domain'), 提供器('telegramcidr', 'ipcidr'), 提供器('cncidr', 'ipcidr'), 提供器('lancidr', 'ipcidr'), 提供器('applications', 'classical'), ''];
  const 规则列表 = ['rules:', '  - DOMAIN-SUFFIX,acl4.ssr,🎯 全球直连', '  - DOMAIN-SUFFIX,local,🎯 全球直连', 解码64('ICAtIERPTUFJTixjbGFzaC5yYXpvcmQudG9wLPCfjq8g5YWo55CD55u06L+e'), '  - DOMAIN,yacd.haishan.me,🎯 全球直连', '  - DOMAIN,yacd.metacubex.one,🎯 全球直连', '  - DOMAIN,d.metacubex.one,🎯 全球直连', '  - DOMAIN-SUFFIX,googleapis.cn,🌐 谷歌服务', '  - DOMAIN-SUFFIX,gstatic.com,🌐 谷歌服务', '  - DOMAIN-SUFFIX,xn--ngstr-lra8j.com,🌐 谷歌服务', '  - DOMAIN-SUFFIX,googlevideo.com,📹 油管视频', '  - DOMAIN-SUFFIX,googleusercontent.com,🌐 谷歌服务', '  - DOMAIN-KEYWORD,youtube,📹 油管视频', '  - DOMAIN-SUFFIX,youtube.com,📹 油管视频', '  - DOMAIN-SUFFIX,youtu.be,📹 油管视频', '  - DOMAIN-KEYWORD,netflix,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxext.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxso.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxvideo.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflximg.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflximg.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,netflix.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,netflix.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,bilibili.com,📺 哔哩哔哩', '  - DOMAIN-SUFFIX,bilivideo.com,📺 哔哩哔哩', '  - DOMAIN-SUFFIX,hdslb.com,📺 哔哩哔哩', '  - DOMAIN-KEYWORD,openai,🤖 OpenAI', '  - DOMAIN-KEYWORD,chatgpt,🤖 OpenAI', '  - DOMAIN-SUFFIX,openai.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,chatgpt.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,oaistatic.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,oaiusercontent.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,anthropic.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,claude.ai,🤖 OpenAI', '  - DOMAIN-SUFFIX,perplexity.ai,🤖 OpenAI', '  - DOMAIN-SUFFIX,gemini.google.com,🤖 OpenAI', '  - RULE-SET,applications,🎯 全球直连', '  - RULE-SET,private,🎯 全球直连', '  - RULE-SET,reject,🛑 全球拦截', '  - RULE-SET,icloud,🍎 苹果服务', '  - RULE-SET,apple,🍎 苹果服务', '  - RULE-SET,google,🌐 谷歌服务', 解码64('ICAtIFJVTEUtU0VULHByb3h5LPCfmoAg6IqC54K56YCJ5oup'), '  - RULE-SET,gfw,🚀 节点选择', '  - RULE-SET,greatfire,🚀 节点选择', '  - RULE-SET,tld-not-cn,🚀 节点选择', '  - RULE-SET,direct,🎯 全球直连', '  - RULE-SET,lancidr,🎯 全球直连,no-resolve', '  - RULE-SET,cncidr,🎯 全球直连,no-resolve', '  - RULE-SET,telegramcidr,📲 电报信息,no-resolve', '  - GEOIP,LAN,🎯 全球直连,no-resolve', '  - GEOIP,CN,🎯 全球直连,no-resolve', '  - MATCH,🐟 漏网之鱼'];
  return [头部581.join('\n'), 值值580.join('\n'), '', 值值577.join('\n'), 规则值.join('\n'), 规则列表.join('\n'), ''].join('\n');
}

function 生成值值数据对象(链接列表) {
  return JSON.stringify(buildSingboxConfig(链接列表.map(解析值链接), { dns: 自定义域名系统 }), null, 2);
}

const 值基础 = 解码64('aHR0cHM6Ly9mYXN0bHkuanNkZWxpdnIubmV0L2doL0FDTDRTU1IvQUNMNFNTUkBtYXN0ZXIvQ2xhc2g=');

const 值规则 = 名称563 => `${值基础}/${名称563}.list`;

function 生成值值562(链接列表561) {
  const 节点列表560 = 链接列表561.map(解析值链接).filter(数量值559 => 数量值559 && 数量值559.proto === 解码64('dHJvamFu'));
  const 域名系统值558 = 自定义域名系统 || '223.5.5.5';
  const 名称列表557 = 节点列表560.map(数量值556 => 数量值556.name);
  const 行列表555 = ['[General]', 'loglevel = notify', 'internet-test-url = http://www.apple.com/library/test/success.html', 解码64('cHJveHktdGVzdC11cmwgPSBodHRwOi8vd3d3LmdzdGF0aWMuY29tL2dlbmVyYXRlXzIwNA=='), 'test-timeout = 3', `dns-server = ${域名系统值558.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}, 119.29.29.29, system`, 'encrypted-dns-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query', 'ipv6 = true', 'allow-wifi-access = false', 'wifi-access-http-port = 6152', 解码64('d2lmaS1hY2Nlc3Mtc29ja3M1LXBvcnQgPSA2MTUz'), 解码64('c2tpcC1wcm94eSA9IDEyNy4wLjAuMSwgMTkyLjE2OC4wLjAvMTYsIDEwLjAuMC4wLzgsIDE3Mi4xNi4wLjAvMTIsIGxvY2FsaG9zdCwgKi5sb2NhbCwgY2FwdGl2ZS5hcHBsZS5jb20='), 'exclude-simple-hostnames = true', 'show-error-page-for-reject = true', '', 解码64('W1Byb3h5XQ==')];
  for (const 数量值554 of 节点列表560) {
    const 服务名称指示 = 数量值554.sni;
    行列表555.push(`${数量值554.name} = ${解码64('dHJvamFu')}, ${数量值554.server}, ${数量值554.port}, password=${数量值554.password}, sni=${服务名称指示}, ws=true, ws-path=${数量值554.path}, ws-headers=Host:${数量值554.host}, skip-cert-verify=false, tfo=true`);
  }
  if (!节点列表560.length) {
    行列表555.push('Direct = direct');
  }
  行列表555.push('');
  行列表555.push(解码64('W1Byb3h5IEdyb3VwXQ=='));
  const 列表553 = 名称列表557.length ? 名称列表557.join(', ') : 'DIRECT';
  行列表555.push(`🚀 节点选择 = select, 🎯 全球直连, ${列表553}`);
  行列表555.push(`🌍 国外媒体 = select, ${处理值值列表(名称列表557)}`);
  行列表555.push(`📺 哔哩哔哩 = select, ${处理值值列表(名称列表557, {
    directFirst: true
  })}`);
  行列表555.push(`📹 油管视频 = select, ${处理值值列表(名称列表557, {
    extraGroups: ['🌍 国外媒体']
  })}`);
  行列表555.push(`🎬 奈飞视频 = select, ${处理值值列表(名称列表557, {
    extraGroups: ['🌍 国外媒体']
  })}`);
  行列表555.push(`📲 电报信息 = select, ${处理值值列表(名称列表557)}`);
  行列表555.push(`🌐 谷歌服务 = select, ${处理值值列表(名称列表557)}`);
  行列表555.push(`🤖 OpenAI = select, ${处理值值列表(名称列表557)}`);
  行列表555.push(`Ⓜ️ 微软服务 = select, ${处理值值列表(名称列表557, {
    directFirst: true
  })}`);
  行列表555.push(`🍎 苹果服务 = select, ${处理值值列表(名称列表557, {
    directFirst: true
  })}`);
  行列表555.push(`🎯 全球直连 = select, DIRECT`);
  行列表555.push(`🛑 全球拦截 = select, REJECT, DIRECT`);
  行列表555.push(`🐟 漏网之鱼 = select, ${处理值值列表(名称列表557)}`);
  行列表555.push('');
  行列表555.push('[Rule]');
  行列表555.push(`RULE-SET,${值规则('LocalAreaNetwork')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('UnBan')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('BanAD')},🛑 全球拦截`);
  行列表555.push(`RULE-SET,${值规则('BanProgramAD')},🛑 全球拦截`);
  行列表555.push(`RULE-SET,${值规则('GoogleFCM')},🌐 谷歌服务`);
  行列表555.push(`RULE-SET,${值规则('GoogleCN')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('SteamCN')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('Microsoft')},Ⓜ️ 微软服务`);
  行列表555.push(`RULE-SET,${值规则('Apple')},🍎 苹果服务`);
  行列表555.push(`RULE-SET,${值规则('Telegram')},📲 电报信息`);
  行列表555.push(`RULE-SET,${值规则('OpenAi')},🤖 OpenAI`);
  行列表555.push(`RULE-SET,${值规则('Claude')},🤖 OpenAI`);
  行列表555.push(`RULE-SET,${值规则('Copilot')},🤖 OpenAI`);
  行列表555.push(`RULE-SET,${值规则('Netflix')},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则('YouTube')},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则('Disney')},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则('Spotify')},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则('TikTok')},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则('BiliBili')},📺 哔哩哔哩`);
  行列表555.push(`RULE-SET,${值规则(解码64('UHJveHlNZWRpYQ=='))},🌍 国外媒体`);
  行列表555.push(`RULE-SET,${值规则(解码64('UHJveHlHRldsaXN0'))},🚀 节点选择`);
  行列表555.push(`RULE-SET,${值规则('ChinaDomain')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('ChinaCompanyIp')},🎯 全球直连`);
  行列表555.push(`RULE-SET,${值规则('ChinaIp')},🎯 全球直连`);
  行列表555.push('GEOIP,CN,🎯 全球直连');
  行列表555.push('FINAL,🐟 漏网之鱼,dns-failed');
  return 行列表555.join('\n');
}

function 生成值值552(链接列表551) {
  const 节点列表550 = 链接列表551.map(解析值链接).filter(数量值549 => 数量值549 && (数量值549.proto === 解码64('dmxlc3M=') || 数量值549.proto === 解码64('dHJvamFu')));
  const 名称列表548 = 节点列表550.map(数量值547 => 数量值547.name);
  const 行列表546 = ['[General]', 'ip-mode = dual', `dns-server = ${(自定义域名系统 || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '')},119.29.29.29,system`, 'doh-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query', 解码64('YWxsb3ctdWRwLXByb3h5ID0gdHJ1ZQ=='), 'allow-wifi-access = false', 'sni-sniffing = true', 解码64('c2tpcC1wcm94eSA9IDEyNy4wLjAuMSwxOTIuMTY4LjAuMC8xNiwxMC4wLjAuMC84LDE3Mi4xNi4wLjAvMTIsbG9jYWxob3N0LCoubG9jYWwsY2FwdGl2ZS5hcHBsZS5jb20='), 'bypass-tun = 10.0.0.0/8,100.64.0.0/10,127.0.0.0/8,169.254.0.0/16,172.16.0.0/12,192.0.0.0/24,192.0.2.0/24,192.88.99.0/24,192.168.0.0/16,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,255.255.255.255/32', '', 解码64('W1Byb3h5XQ==')];
  for (const 数量值545 of 节点列表550) {
    if (数量值545.proto === 解码64('dmxlc3M=')) {
      const 部分列表544 = [`${数量值545.server}`, `${数量值545.port}`, `udp=true`, `username=${数量值545.uuid}`, `transport=ws`, `path=${数量值545.path}`, `host=${数量值545.host}`, `over-tls=${数量值545.tls ? 'true' : 'false'}`];
      if (数量值545.tls) {
        部分列表544.push(`tls-name=${数量值545.sni}`);
        if (数量值545.alpn && 数量值545.alpn.length) 部分列表544.push(`alpn=${数量值545.alpn.join(':')}`);
        部分列表544.push(`skip-cert-verify=false`);
      }
      行列表546.push(`${数量值545.name} = ${解码64('dmxlc3M=')},${部分列表544.join(',')}`);
    } else {
      const 部分列表543 = [`${数量值545.server}`, `${数量值545.port}`, `password=${数量值545.password}`, `transport=ws`, `path=${数量值545.path}`, `host=${数量值545.host}`, `over-tls=true`, `tls-name=${数量值545.sni}`];
      if (数量值545.alpn && 数量值545.alpn.length) 部分列表543.push(`alpn=${数量值545.alpn.join(':')}`);
      部分列表543.push(`skip-cert-verify=false`);
      行列表546.push(`${数量值545.name} = ${解码64('dHJvamFu')},${部分列表543.join(',')}`);
    }
  }
  行列表546.push('');
  行列表546.push(解码64('W1Byb3h5IEdyb3VwXQ=='));
  const 列表542 = 名称列表548.length ? 名称列表548.join(',') : 'DIRECT';
  行列表546.push(`🚀 节点选择 = select,🎯 全球直连,${列表542}`);
  行列表546.push(`🌍 国外媒体 = select,${处理值值列表(名称列表548, {
    compact: true
  })}`);
  行列表546.push(`📺 哔哩哔哩 = select,${处理值值列表(名称列表548, {
    directFirst: true,
    compact: true
  })}`);
  行列表546.push(`📹 油管视频 = select,${处理值值列表(名称列表548, {
    extraGroups: ['🌍 国外媒体'],
    compact: true
  })}`);
  行列表546.push(`🎬 奈飞视频 = select,${处理值值列表(名称列表548, {
    extraGroups: ['🌍 国外媒体'],
    compact: true
  })}`);
  行列表546.push(`📲 电报信息 = select,${处理值值列表(名称列表548, {
    compact: true
  })}`);
  行列表546.push(`🌐 谷歌服务 = select,${处理值值列表(名称列表548, {
    compact: true
  })}`);
  行列表546.push(`🤖 OpenAI = select,${处理值值列表(名称列表548, {
    compact: true
  })}`);
  行列表546.push(`Ⓜ️ 微软服务 = select,${处理值值列表(名称列表548, {
    directFirst: true,
    compact: true
  })}`);
  行列表546.push(`🍎 苹果服务 = select,${处理值值列表(名称列表548, {
    directFirst: true,
    compact: true
  })}`);
  行列表546.push(`🎯 全球直连 = select,DIRECT`);
  行列表546.push(`🛑 全球拦截 = select,REJECT,DIRECT`);
  行列表546.push(`🐟 漏网之鱼 = select,${处理值值列表(名称列表548, {
    compact: true
  })}`);
  行列表546.push('');
  行列表546.push('[Remote Rule]');
  行列表546.push(`${值规则('LocalAreaNetwork')}, policy=🎯 全球直连, tag=局域网, enabled=true`);
  行列表546.push(`${值规则('BanAD')}, policy=🛑 全球拦截, tag=广告拦截, enabled=true`);
  行列表546.push(`${值规则('BanProgramAD')}, policy=🛑 全球拦截, tag=应用广告, enabled=true`);
  行列表546.push(`${值规则('GoogleCN')}, policy=🎯 全球直连, tag=GoogleCN, enabled=true`);
  行列表546.push(`${值规则('SteamCN')}, policy=🎯 全球直连, tag=SteamCN, enabled=true`);
  行列表546.push(`${值规则('Microsoft')}, policy=Ⓜ️ 微软服务, tag=微软, enabled=true`);
  行列表546.push(`${值规则('Apple')}, policy=🍎 苹果服务, tag=苹果, enabled=true`);
  行列表546.push(`${值规则('Telegram')}, policy=📲 电报信息, tag=电报, enabled=true`);
  行列表546.push(`${值规则('OpenAi')}, policy=🤖 OpenAI, tag=OpenAI, enabled=true`);
  行列表546.push(`${值规则('Netflix')}, policy=🌍 国外媒体, tag=Netflix, enabled=true`);
  行列表546.push(`${值规则('YouTube')}, policy=🌍 国外媒体, tag=YouTube, enabled=true`);
  行列表546.push(`${值规则('Disney')}, policy=🌍 国外媒体, tag=Disney, enabled=true`);
  行列表546.push(`${值规则('Spotify')}, policy=🌍 国外媒体, tag=Spotify, enabled=true`);
  行列表546.push(`${值规则('TikTok')}, policy=🌍 国外媒体, tag=TikTok, enabled=true`);
  行列表546.push(`${值规则('BiliBili')}, policy=📺 哔哩哔哩, tag=哔哩哔哩, enabled=true`);
  行列表546.push(`${值规则(解码64('UHJveHlNZWRpYQ=='))}, policy=🌍 国外媒体, tag=${解码64('5Luj55CG5aqS5L2T')}, enabled=true`);
  行列表546.push(`${值规则(解码64('UHJveHlHRldsaXN0'))}, policy=🚀 节点选择, tag=${解码64('5Luj55CG5YiX6KGo')}, enabled=true`);
  行列表546.push(`${值规则('ChinaDomain')}, policy=🎯 全球直连, tag=中国域名, enabled=true`);
  行列表546.push(`${值规则('ChinaIp')}, policy=🎯 全球直连, tag=中国IP, enabled=true`);
  行列表546.push('');
  行列表546.push('[Rule]');
  行列表546.push('GEOIP,CN,🎯 全球直连');
  行列表546.push('FINAL,🐟 漏网之鱼');
  return 行列表546.join('\n');
}

function 生成值值(链接列表541) {
  const 节点列表 = 链接列表541.map(解析值链接).filter(数量值540 => 数量值540 && (数量值540.proto === 解码64('dmxlc3M=') || 数量值540.proto === 解码64('dHJvamFu')));
  const 名称列表 = 节点列表.map(数量值539 => 数量值539.name);
  const 圈叉基础配置 = 解码64('aHR0cHM6Ly9mYXN0bHkuanNkZWxpdnIubmV0L2doL2JsYWNrbWF0cml4Ny9pb3NfcnVsZV9zY3JpcHRAbWFzdGVyL3J1bGUvUXVhbnR1bXVsdFg=');
  const 行列表538 = ['[general]', 'network_check_url=http://www.gstatic.com/generate_204', 'server_check_url=http://www.gstatic.com/generate_204', 'profile_img_url=https://fastly.jsdelivr.net/gh/byJoey/cfnew@main/snippets/logo.png', 'dns_exclusion_list=*.cmpassport.com, *.jegotrip.com.cn, *.icloud.com, *.icloud.com.cn, *.apple.com, *.weibo.com, *.qq.com', 'running_mode_trigger=filter', '', '[dns]', `server=${(自定义域名系统 || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`, 'server=119.29.29.29', 'server=https://223.5.5.5/dns-query', 'server=https://1.12.12.12/dns-query', '', '[server_local]'];
  for (const 数量值537 of 节点列表) {
    if (数量值537.proto === 解码64('dmxlc3M=')) {
      const 部分列表536 = [`${数量值537.server}:${数量值537.port}`, `method=none`, `password=${数量值537.uuid}`, `obfs=${数量值537.tls ? 'wss' : 'ws'}`, `obfs-host=${数量值537.host}`, `obfs-uri=${数量值537.path}`];
      if (数量值537.tls) 部分列表536.push(`tls-verification=true`, `tls13=true`);
      部分列表536.push(`tag=${数量值537.name}`);
      行列表538.push(`${解码64('dmxlc3M=')}=${部分列表536.join(', ')}`);
    } else {
      const 部分列表535 = [`${数量值537.server}:${数量值537.port}`, `password=${数量值537.password}`, `over-tls=true`, `tls-host=${数量值537.sni}`, `obfs=wss`, `obfs-host=${数量值537.host}`, `obfs-uri=${数量值537.path}`, `tls-verification=true`, `tag=${数量值537.name}`];
      行列表538.push(`${解码64('dHJvamFu')}=${部分列表535.join(', ')}`);
    }
  }
  行列表538.push('');
  行列表538.push('[policy]');
  const 列表534 = 名称列表.length ? 名称列表.join(', ') : 'direct';
  行列表538.push(`static=🚀 节点选择, ${列表534}, direct, img-url=${解码64('aHR0cHM6Ly9mYXN0bHkuanNkZWxpdnIubmV0L2doL0tvb2xzb24vUXVyZUBtYXN0ZXIvSWNvblNldC9Db2xvci9Qcm94eS5wbmc=')}`);
  行列表538.push(`static=🌍 国外媒体, ${处理值值列表(名称列表)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ForeignMedia.png`);
  行列表538.push(`static=📺 哔哩哔哩, ${处理值值列表(名称列表, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png`);
  行列表538.push(`static=📹 油管视频, ${处理值值列表(名称列表, {
    extraGroups: ['🌍 国外媒体']
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png`);
  行列表538.push(`static=🎬 奈飞视频, ${处理值值列表(名称列表, {
    extraGroups: ['🌍 国外媒体']
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png`);
  行列表538.push(`static=📲 电报信息, ${处理值值列表(名称列表)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png`);
  行列表538.push(`static=🌐 谷歌服务, ${处理值值列表(名称列表)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png`);
  行列表538.push(`static=🤖 OpenAI, ${处理值值列表(名称列表)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png`);
  行列表538.push(`static=Ⓜ️ 微软服务, ${处理值值列表(名称列表, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png`);
  行列表538.push(`static=🍎 苹果服务, ${处理值值列表(名称列表, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png`);
  行列表538.push(`static=🎯 全球直连, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png`);
  行列表538.push(`static=🛑 全球拦截, reject, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png`);
  行列表538.push(`static=🐟 漏网之鱼, ${处理值值列表(名称列表)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png`);
  行列表538.push('');
  行列表538.push('[filter_remote]');
  行列表538.push(`${圈叉基础配置}/Lan/Lan.list, tag=局域网, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Advertising/Advertising.list, tag=广告拦截, force-policy=🛑 全球拦截, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Microsoft/Microsoft.list, tag=微软, force-policy=Ⓜ️ 微软服务, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Apple/Apple.list, tag=苹果, force-policy=🍎 苹果服务, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Telegram/Telegram.list, tag=电报, force-policy=📲 电报信息, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Google/Google.list, tag=谷歌, force-policy=🌐 谷歌服务, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/OpenAI/OpenAI.list, tag=OpenAI, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Claude/Claude.list, tag=Claude, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/YouTube/YouTube.list, tag=YouTube, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Netflix/Netflix.list, tag=Netflix, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Disney/Disney.list, tag=Disney, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Spotify/Spotify.list, tag=Spotify, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/TikTok/TikTok.list, tag=TikTok, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/BiliBili/BiliBili.list, tag=哔哩哔哩, force-policy=📺 哔哩哔哩, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/Global/Global.list, tag=全球加速, force-policy=🚀 节点选择, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push(`${圈叉基础配置}/ChinaMax/ChinaMax.list, tag=中国直连, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  行列表538.push('');
  行列表538.push('[filter_local]');
  行列表538.push('geoip, cn, 🎯 全球直连');
  行列表538.push('final, 🐟 漏网之鱼');
  return 行列表538.join('\n');
}

const 家宽节点源 = 解码64('aHR0cHM6Ly93d3cudnBuZ2F0ZS5uZXQvYXBpL2lwaG9uZS8=');

const 家宽节点类型 = 解码64('b3BlbnZwbg==');

const 家宽前置字段 = 解码64('ZGlhbGVyLXByb3h5');

const 家宽机房前缀 = 解码64('cHVibGljLXZwbg==');

const 家宽机房网段 = '219.100.37.';

const 家宽缓存期限 = 30 * 60 * 1000;

let 家宽缓存 = null;

let 家宽缓存时间 = 0;

const 家宽指令正则 = {};

function 取家宽指令(配置文本, 指令名) {
  if (!家宽指令正则[指令名]) 家宽指令正则[指令名] = new RegExp('^[ \\t]*' + 指令名 + '[ \\t]+(.+?)[ \\t]*$', 'm');
  const 命中 = 配置文本.match(家宽指令正则[指令名]);
  return 命中 ? 命中[1].trim() : '';
}

function 取家宽内联块(配置文本, 标签) {
  const 命中 = 配置文本.match(new RegExp('<' + 标签 + '>([\\s\\S]*?)<\\/' + 标签 + '>'));
  return 命中 ? 命中[1].trim() : '';
}

function 缩进证书文本(文本, 空白) {
  return 文本.split('\n').map(行 => 行.trim()).filter(行 => 行).map(行 => 空白 + 行).join('\n');
}

const 家宽前段长度 = 6000;

function 解家宽配置(配置64, 整条 = false) {
  const 干净 = 配置64.replace(/\s/g, '');
  if (整条 || 干净.length <= 家宽前段长度) return 解码64(干净);
  return 解码64(干净.slice(0, 家宽前段长度));
}

function 解析家宽清单(原文) {
  const 候选 = [];
  for (const 原始行 of 原文.split('\n')) {
    const 行 = 原始行.trim();
    if (!行 || 行.charAt(0) === '*' || 行.charAt(0) === '#') continue;
    const 字段 = 行.split(',');
    if (字段.length < 15) continue;
    // 只要住宅宽带：官方自己架的机房服务器剔掉，而且那批容易满员握手失败
    if ((字段[0] || '').indexOf(家宽机房前缀) === 0) continue;
    if ((字段[1] || '').indexOf(家宽机房网段) === 0) continue;
    const 配置64 = 字段[字段.length - 1];
    if (!配置64 || 配置64.length < 100) continue;
    候选.push({ 国家: (字段[6] || '').toUpperCase() || 'XX', 速度: parseInt(字段[4], 10) || 0, 配置64 });
  }
  // 按速度倒序。试过挑会话数最少的，结果更差（6/12 对 2/12）：
  // 会话少多半是这台根本连不上，不是空闲，别按会话数挑。
  候选.sort((甲, 乙) => 乙.速度 - 甲.速度);
  const 节点列表 = [];
  let 证书 = null;
  for (const 项 of 候选) {
    let 配置文本 = '';
    try {
      配置文本 = 解家宽配置(项.配置64);
      if (!取家宽指令(配置文本, 'remote')) 配置文本 = 解家宽配置(项.配置64, true);
    } catch (错误) {
      continue;
    }
    // 前置只能承载 TCP，UDP 的节点丢掉
    if ((取家宽指令(配置文本, 'proto') || 'tcp').toLowerCase() !== 'tcp') continue;
    const 远端 = 取家宽指令(配置文本, 'remote').split(/\s+/);
    if (!远端[0]) continue;
    if (!证书) {
      // 证书全站共用一份，找第一个完整的就够了
      try {
        const 全文 = 解家宽配置(项.配置64, true);
        const 本次证书 = { ca: 取家宽内联块(全文, 'ca'), cert: 取家宽内联块(全文, 'cert'), key: 取家宽内联块(全文, 'key') };
        if (本次证书.ca && 本次证书.cert && 本次证书.key) 证书 = 本次证书;
      } catch (错误) {}
      if (!证书) continue;
    }
    节点列表.push({
      国家: 项.国家,
      地址: 远端[0],
      端口: parseInt(远端[1], 10) || 443,
      加密: 取家宽指令(配置文本, 'cipher') || 'AES-128-CBC',
      摘要: 取家宽指令(配置文本, 'auth') || 'SHA1'
    });
  }
  return { 节点列表, 证书 };
}

async function 获取家宽节点() {
  const 现在 = Date.now();
  if (家宽缓存 && 现在 - 家宽缓存时间 < 家宽缓存期限) return 家宽缓存;
  // 节点源的 TLS 很老（没有 TLS1.3，ECDHE 只有 CBC 套件），有的运行环境握不上，
  // 握不上就退回明文再拉一次。清单本身是公开数据。
  let 原文 = '';
  let 最后错误 = null;
  for (const 源 of [家宽节点源, 家宽节点源.replace(/^https:/, 'http:')]) {
    try {
      const 响应 = await fetch(源, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/plain' },
        cf: { cacheTtl: 1800, cacheEverything: true }
      });
      if (!响应.ok) {
        最后错误 = new Error('节点源返回 ' + 响应.status);
        continue;
      }
      原文 = await 响应.text();
      break;
    } catch (错误) {
      最后错误 = 错误;
    }
  }
  if (!原文) throw 最后错误 || new Error('节点源没有返回内容');
  const 结果 = 解析家宽清单(原文);
  if (!结果.节点列表.length || !结果.证书) throw new Error('没解析出能用的节点');
  家宽缓存 = 结果;
  家宽缓存时间 = 现在;
  return 结果;
}

async function 生成家宽链式值(链接列表) {
  const 前置组名 = '\u26a1 CF前置';
  const 家宽自动 = '\ud83c\udfe0 家宽自动';
  const 家宽手选 = '\ud83c\udfe0 家宽节点';
  const 节点选择 = '\ud83d\ude80 节点选择';
  const 全部前置 = 链接列表.map(解析值链接)
    .filter(项 => 项 && (项.proto === 解码64('dmxlc3M=') || 项.proto === 解码64('dHJvamFu')));
  // 落地隧道的握手特征很明显，前置用明文会被一眼认出来，有 TLS 节点就只用 TLS 的
  const 加密前置 = 全部前置.filter(项 => 项.tls);
  const 前置节点 = 加密前置.length ? 加密前置 : 全部前置;
  const 前置名称 = 前置节点.map(项 => 项.name);
  const 域名系统 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
  const { 节点列表, 证书 } = await 获取家宽节点();
  const 国家计数 = {};
  const 家宽项 = 节点列表.map(节点 => {
    国家计数[节点.国家] = (国家计数[节点.国家] || 0) + 1;
    return { ...节点, 名称: '\ud83c\udfe0 ' + 节点.国家 + '-家宽-' + String(国家计数[节点.国家]).padStart(2, '0') };
  });
  const 头部 = [
    '# cfnew 家宽订阅：CF 节点带路，落地是住宅宽带',
    '# 内核要 1.19.25 以上，老内核不认这类节点',
    '# 节点是网友共享的，掉线很正常，家宽自动会自己往下换',
    'mixed-port: 7890',
    'allow-lan: false',
    'mode: rule',
    'log-level: info',
    'ipv6: false',
    'unified-delay: true',
    'tcp-concurrent: true',
    'external-controller: 127.0.0.1:9090',
    'dns:',
    '  enable: true',
    '  ipv6: false',
    '  enhanced-mode: fake-ip',
    '  fake-ip-range: 198.18.0.1/16',
    '  nameserver:',
    '    - ' + 域名系统,
    '    - https://1.1.1.1/dns-query',
    ''
  ];
  const 节点段 = ['proxies:'];
  for (const 项 of 前置节点) 节点段.push(构建值节点行(项));
  家宽项.forEach((节点, 下标) => {
    const 行 = [
      '  - name: "' + 节点.名称 + '"',
      '    type: ' + 家宽节点类型,
      '    server: ' + 节点.地址,
      '    port: ' + 节点.端口,
      '    proto: tcp',
      '    username: vpn',
      '    password: vpn',
      '    cipher: ' + 节点.加密,
      '    auth: ' + 节点.摘要,
      '    udp: false',
      '    handshake-timeout: 30',
      '    remote-dns-resolve: true',
      '    dns: [ 8.8.8.8, 1.1.1.1 ]'
    ];
    // 一个前置都没有就退化成直连落地，订阅至少还能用
    if (前置名称.length) 行.push('    ' + 家宽前置字段 + ': "' + 前置组名 + '"');
    // 证书全站同一份，第一个节点定锚点，后面引用，全量几十个节点能省下几百 KB
    if (下标 === 0) {
      行.push('    ca: &jkca |-', 缩进证书文本(证书.ca, '      '));
      行.push('    cert: &jkcert |-', 缩进证书文本(证书.cert, '      '));
      行.push('    key: &jkkey |-', 缩进证书文本(证书.key, '      '));
    } else {
      行.push('    ca: *jkca', '    cert: *jkcert', '    key: *jkkey');
    }
    节点段.push(行.join('\n'));
  });
  const 列出 = 名称列表 => 名称列表.map(名称 => '      - "' + 名称 + '"').join('\n');
  // 自动组按速度排，决定回落顺序；手选组按国家排，翻起来好找
  const 按速度 = 家宽项.map(项 => 项.名称);
  const 按国家 = 家宽项.slice().sort((甲, 乙) => 甲.国家 === 乙.国家 ? 0 : (甲.国家 < 乙.国家 ? -1 : 1)).map(项 => 项.名称);
  const 分组段 = [解码64('cHJveHktZ3JvdXBzOg==')];
  if (前置名称.length) {
    分组段.push('  - name: "' + 前置组名 + '"', '    type: url-test',
      '    url: https://www.gstatic.com/generate_204', '    interval: 300', '    tolerance: 50',
      '    proxies:', 列出(前置名称));
  }
  // 全量几十个节点，测一轮就是几十次握手，所以间隔拉长、用到才测
  分组段.push('  - name: "' + 家宽自动 + '"', '    type: fallback',
    '    url: https://www.gstatic.com/generate_204', '    interval: 1800', '    lazy: true',
    '    proxies:', 列出(按速度));
  分组段.push('  - name: "' + 家宽手选 + '"', '    type: select', '    proxies:', 列出(按国家));
  const 主选列表 = ['      - "' + 家宽自动 + '"', '      - "' + 家宽手选 + '"'];
  if (前置名称.length) 主选列表.push('      - "' + 前置组名 + '"');
  主选列表.push('      - DIRECT');
  分组段.push('  - name: "' + 节点选择 + '"', '    type: select', '    proxies:', 主选列表.join('\n'));
  const 规则段 = [
    'rules:',
    '  - GEOIP,LAN,DIRECT,no-resolve',
    '  - GEOIP,CN,DIRECT,no-resolve',
    '  - MATCH,' + 节点选择
  ];
  return 头部.concat(节点段, [''], 分组段, [''], 规则段, ['']).join('\n');
}

async function 处理订阅请求(请求507, 用户506, 网址505 = null) {
  if (!网址505) 网址505 = new URL(请求507.url);
  const 最终链接列表 = [];
  const 工作器域名504 = 网址505.hostname;
  const 目标503 = 网址505.searchParams.get('target') || 'base64';
  const 家宽目标 = ['vg', 'jk', 解码64('amlha3Vhbg==')].includes(目标503.toLowerCase());
  if (家宽目标 && !启用家宽链式) {
    return new Response('家宽链式没开。去配置管理勾上「开启家宽链式」，或者加环境变量 jk=yes。', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
  const 别名命名器502 = 创建值节点命名器(false);

  // 如果启用了ECH，使用自定义值
  let 加密客户端问候配置501 = null;
  if (启用加密客户端问候) {
    const 域名系统值500 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
    const 加密客户端问候域名499 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
    加密客户端问候配置501 = `${加密客户端问候域名499}+${域名系统值500}`;
  }
  async function 添加节点列表来源列表(列表498) {
    if (启用明文) {
      最终链接列表.push(...生成链接列表来源源(列表498, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502));
    }
    if (启用木马) {
      最终链接列表.push(...(await 生成木马链接列表来源源(列表498, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502)));
    }
    if (启用扩展传输) {
      最终链接列表.push(...生成扩展超文本链接列表来源源(列表498, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502));
    }
  }
  if (启用原生地址) {
    if (当前工作器地区 === 'CUSTOM') {
      const 原生列表497 = [{
        ip: 工作器域名504,
        isp: '原生地址'
      }];
      await 添加节点列表来源列表(原生列表497);
    } else {
      try {
        const 原生列表496 = [{
          ip: 工作器域名504,
          isp: '原生地址'
        }];
        await 添加节点列表来源列表(原生列表496);
      } catch (错误495) {
        if (!当前工作器地区) {
          当前工作器地区 = 'CF';
        }
        const 值备用地址494 = await 获取值备用地址(当前工作器地区);
        if (值备用地址494) {
          回退地址 = 值备用地址494.domain + ':' + 值备用地址494.port;
          const 备用列表493 = [{
            ip: 值备用地址494.domain,
            isp: 解码64('UHJveHlJUC0=') + 当前工作器地区
          }];
          await 添加节点列表来源列表(备用列表493);
        } else {
          const 原生列表 = [{
            ip: 工作器域名504,
            isp: '原生地址'
          }];
          await 添加节点列表来源列表(原生列表);
        }
      }
    }
  }
  const 是否有自定义优选 = 自定义优选地址列表.length > 0 || 自定义优选域名列表.length > 0;
  if (禁用优选) {} else if (是否有自定义优选) {
    if (自定义优选地址列表.length > 0 && 启用优选地址) {
      await 添加节点列表来源列表(自定义优选地址列表);
    }
    if (自定义优选域名列表.length > 0 && 启用优选域名) {
      const 自定义域名列表 = 自定义优选域名列表.map(丁值492 => ({
        ip: 丁值492.domain,
        port: 丁值492.port,
        isp: 丁值492.name || 丁值492.domain
      }));
      await 添加节点列表来源列表(自定义域名列表);
    }
  } else {
    if (启用优选域名) {
      const 域名列表 = 直连域名列表.map(丁值491 => ({
        ip: 丁值491.domain,
        isp: 丁值491.name || 丁值491.domain
      }));
      await 添加节点列表来源列表(域名列表);
    }
    if (启用优选地址) {
      if (!优选地址源) {
        try {
          const 值地址列表490 = await 获取值地址列表();
          if (值地址列表490.length > 0) {
            await 添加节点列表来源列表(值地址列表490);
          }
        } catch (错误489) {
          if (!当前工作器地区) {
            当前工作器地区 = 'CF';
          }
          const 值备用地址488 = await 获取值备用地址(当前工作器地区);
          if (值备用地址488) {
            回退地址 = 值备用地址488.domain + ':' + 值备用地址488.port;
            const 备用列表487 = [{
              ip: 值备用地址488.domain,
              isp: 解码64('UHJveHlJUC0=') + 当前工作器地区
            }];
            await 添加节点列表来源列表(备用列表487);
          }
        }
      }
    }
    if (启用仓库优选) {
      try {
        const 新地址列表 = await 获取值解析新地址列表();
        if (新地址列表.length > 0) {
          if (启用明文) {
            最终链接列表.push(...生成链接列表来源新地址列表(新地址列表, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502));
          }
          if (启用木马) {
            最终链接列表.push(...(await 生成木马链接列表来源新地址列表(新地址列表, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502)));
          }
          if (启用扩展传输) {
            最终链接列表.push(...生成扩展超文本链接列表来源源(新地址列表, 用户506, 工作器域名504, 加密客户端问候配置501, false, 别名命名器502));
          }
        }
      } catch (错误486) {
        if (!当前工作器地区) {
          当前工作器地区 = 'CF';
        }
        const 值备用地址485 = await 获取值备用地址(当前工作器地区);
        if (值备用地址485) {
          回退地址 = 值备用地址485.domain + ':' + 值备用地址485.port;
          const 备用列表 = [{
            ip: 值备用地址485.domain,
            isp: 解码64('UHJveHlJUC0=') + 当前工作器地区
          }];
          await 添加节点列表来源列表(备用列表);
        }
      }
    }
  }
  if (最终链接列表.length === 0) {
    const 错误备注 = "所有节点获取失败";
    const 协议484 = atob('dmxlc3M=');
    const 错误链接 = `${协议484}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?encryption=none&security=none&type=ws&host=error.com&path=%2F#${encodeURIComponent(错误备注)}`;
    最终链接列表.push(错误链接);
  }
  let 订阅内容;
  let 内容类型483 = 'text/plain; charset=utf-8';
  switch (目标503.toLowerCase()) {
    case atob('Y2xhc2g='):
    case atob('Y2xhc2hy'):
    case 解码64('c3Rhc2g='):
    case 'meta':
    case 解码64('Y2xhc2htZXRh'):
      订阅内容 = 生成值值589(最终链接列表);
      内容类型483 = 'text/yaml; charset=utf-8';
      break;
    case 'vg':
    case 'jk':
    case 解码64('amlha3Vhbg=='):
      try {
        订阅内容 = await 生成家宽链式值(最终链接列表);
      } catch (错误) {
        return new Response('家宽节点暂时拉不到：' + (错误 && 错误.message ? 错误.message : 错误) + '\n过几分钟再更新，客户端会先用着上一份。', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
        });
      }
      内容类型483 = 'text/yaml; charset=utf-8';
      break;
    case atob('c3VyZ2U='):
    case atob('c3VyZ2Uy'):
    case atob('c3VyZ2Uz'):
    case atob('c3VyZ2U0'):
      订阅内容 = 生成值值562(最终链接列表);
      内容类型483 = 'text/plain; charset=utf-8';
      break;
    case atob('cXVhbnR1bXVsdA=='):
    case atob('cXVhbng='):
    case 解码64('cXVhbng='):
      订阅内容 = 生成值值(最终链接列表);
      内容类型483 = 'text/plain; charset=utf-8';
      break;
    case atob('c3M='):
    case atob('c3Ny'):
      订阅内容 = btoa(最终链接列表.join('\n'));
      break;
    case atob('djJyYXk='):
      订阅内容 = btoa(最终链接列表.join('\n'));
      break;
    case atob('bG9vbg=='):
      订阅内容 = 生成值值552(最终链接列表);
      内容类型483 = 'text/plain; charset=utf-8';
      break;
    case atob('c2luZ2JveA=='):
    case 解码64('c2luZy1ib3g='):
    case 解码64('c2luZ2JveA=='):
      订阅内容 = 生成值值数据对象(最终链接列表);
      内容类型483 = 'application/json; charset=utf-8';
      break;
    default:
      订阅内容 = btoa(最终链接列表.join('\n'));
  }
  const 响应头部列表 = {
    'Content-Type': 内容类型483,
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  };
  if (内容类型483.startsWith('application/json')) 响应头部列表.Link = '</rules-license>; rel="license"';

  // 添加ECH状态到响应头
  if (启用加密客户端问候) {
    响应头部列表['X-ECH-Status'] = 'ENABLED';
    if (加密客户端问候配置501) {
      响应头部列表['X-ECH-Config-Length'] = String(加密客户端问候配置501.length);
    }
  }
  return new Response(订阅内容, {
    headers: 响应头部列表
  });
}

function 生成链接列表来源源(列表482, 用户481, 工作器域名480, 加密客户端问候配置479 = null, 跳过编号478 = false, 别名命名器477 = null) {
  const 云墙超文本端口476 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const 云墙安全超文本端口475 = [443, 2053, 2083, 2087, 2096, 8443];
  const 默认安全超文本值474 = [443];
  const 默认超文本值473 = 禁用非传输层安全 ? [] : [80];
  const 链接列表472 = [];
  const 网页套接字路径471 = '/?ed=2048';
  const 协议470 = atob('dmxlc3M=');
  const 制作节点名称469 = 别名命名器477 || 创建值节点命名器(跳过编号478);
  for (const 项目468 of 列表482) {
    const 安全地址467 = 项目468.ip.includes(':') ? `[${项目468.ip}]` : 项目468.ip;
    let 值值生成466 = [];
    if (项目468.port) {
      const 端口465 = 项目468.port;
      if (云墙安全超文本端口475.includes(端口465)) {
        值值生成466.push({
          port: 端口465,
          tls: true
        });
      } else if (云墙超文本端口476.includes(端口465)) {
        if (!禁用非传输层安全) {
          值值生成466.push({
            port: 端口465,
            tls: false
          });
        }
      } else {
        值值生成466.push({
          port: 端口465,
          tls: true
        });
      }
    } else {
      默认安全超文本值474.forEach(端口464 => {
        值值生成466.push({
          port: 端口464,
          tls: true
        });
      });
      默认超文本值473.forEach(端口463 => {
        值值生成466.push({
          port: 端口463,
          tls: false
        });
      });
    }
    for (const {
      port: 端口462,
      tls: 传输层安全461
    } of 值值生成466) {
      const 网页套接字节点名称460 = 制作节点名称469(项目468);
      if (传输层安全461) {
        const 网页套接字参数459 = new URLSearchParams({
          encryption: 'none',
          security: 'tls',
          sni: 工作器域名480,
          // randomized fingerprint may cause TLS compatibility issues with some Xray/uTLS clients.
          // Use chrome as default for better compatibility (chrome is also required when ECH is enabled).
          fp: 'chrome',
          type: 'ws',
          host: 工作器域名480,
          path: 网页套接字路径471
        });
        处理值应用层协议协商值(网页套接字参数459);

        // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
        if (启用加密客户端问候) {
          const 域名系统值458 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
          const 加密客户端问候域名457 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
          网页套接字参数459.set('ech', `${加密客户端问候域名457}+${域名系统值458}`);
        }
        链接列表472.push(`${协议470}://${用户481}@${安全地址467}:${端口462}?${网页套接字参数459.toString()}#${encodeURIComponent(网页套接字节点名称460)}`);
      } else {
        const 网页套接字参数456 = new URLSearchParams({
          encryption: 'none',
          security: 'none',
          type: 'ws',
          host: 工作器域名480,
          path: 网页套接字路径471
        });
        链接列表472.push(`${协议470}://${用户481}@${安全地址467}:${端口462}?${网页套接字参数456.toString()}#${encodeURIComponent(网页套接字节点名称460)}`);
      }
    }
  }
  return 链接列表472;
}

async function 生成木马链接列表来源源(列表455, 用户454, 工作器域名453, 加密客户端问候配置452 = null, 跳过编号451 = false, 别名命名器450 = null) {
  const 云墙超文本端口449 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const 云墙安全超文本端口448 = [443, 2053, 2083, 2087, 2096, 8443];
  const 默认安全超文本值 = [443];
  const 默认超文本值 = 禁用非传输层安全 ? [] : [80];
  const 链接列表447 = [];
  const 网页套接字路径446 = '/?ed=2048';
  const 密码445 = 传输路径 || 用户454;
  const 制作节点名称444 = 别名命名器450 || 创建值节点命名器(跳过编号451);
  for (const 项目443 of 列表455) {
    const 安全地址442 = 项目443.ip.includes(':') ? `[${项目443.ip}]` : 项目443.ip;
    let 值值生成 = [];
    if (项目443.port) {
      const 端口441 = 项目443.port;
      if (云墙安全超文本端口448.includes(端口441)) {
        值值生成.push({
          port: 端口441,
          tls: true
        });
      } else if (云墙超文本端口449.includes(端口441)) {
        if (!禁用非传输层安全) {
          值值生成.push({
            port: 端口441,
            tls: false
          });
        }
      } else {
        值值生成.push({
          port: 端口441,
          tls: true
        });
      }
    } else {
      默认安全超文本值.forEach(端口440 => {
        值值生成.push({
          port: 端口440,
          tls: true
        });
      });
      默认超文本值.forEach(端口439 => {
        值值生成.push({
          port: 端口439,
          tls: false
        });
      });
    }
    for (const {
      port: 端口438,
      tls: 传输层安全
    } of 值值生成) {
      const 网页套接字节点名称437 = 制作节点名称444(项目443);
      if (传输层安全) {
        const 网页套接字参数436 = new URLSearchParams({
          security: 'tls',
          sni: 工作器域名453,
          fp: 'chrome',
          type: 'ws',
          host: 工作器域名453,
          path: 网页套接字路径446
        });
        处理值应用层协议协商值(网页套接字参数436);

        // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
        if (启用加密客户端问候) {
          const 域名系统值435 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
          const 加密客户端问候域名434 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
          网页套接字参数436.set('ech', `${加密客户端问候域名434}+${域名系统值435}`);
        }
        链接列表447.push(`${atob('dHJvamFuOi8v')}${密码445}@${安全地址442}:${端口438}?${网页套接字参数436.toString()}#${encodeURIComponent(网页套接字节点名称437)}`);
      } else {
        const 网页套接字参数 = new URLSearchParams({
          security: 'none',
          type: 'ws',
          host: 工作器域名453,
          path: 网页套接字路径446
        });
        链接列表447.push(`${atob('dHJvamFuOi8v')}${密码445}@${安全地址442}:${端口438}?${网页套接字参数.toString()}#${encodeURIComponent(网页套接字节点名称437)}`);
      }
    }
  }
  return 链接列表447;
}

async function 计算值摘要(文本434) { return createHash('md5').update(文本434).digest('hex'); }

async function 获取值地址列表() {
  const 分组线路映射 = {
    ctcc: '电信',
    cucc: '联通',
    cmcc: '移动',
    bgp: '多线',
    ipv6: 'IPv6'
  };
  const 值4已启用 = 获取配置值('ipv4', '') === '' || 获取配置值('ipv4', 'yes') !== 'no';
  const 值6已启用 = 获取配置值('ipv6', '') === '' || 获取配置值('ipv6', 'yes') !== 'no';
  const 值值432 = 获取配置值('ispMobile', '') === '' || 获取配置值('ispMobile', 'yes') !== 'no';
  const 值值431 = 获取配置值('ispUnicom', '') === '' || 获取配置值('ispUnicom', 'yes') !== 'no';
  const 值值430 = 获取配置值('ispTelecom', '') === '' || 获取配置值('ispTelecom', 'yes') !== 'no';
  try {
    const 时间戳434 = String(Date.now());
    const 内层摘要434 = await 计算值摘要(解码64('RGRsVHh0TjBzVU91'));
    const 请求密钥434 = await 计算值摘要(内层摘要434 + 解码64('NzBjbG91ZGZsYXJlYXBpa2V5') + 时间戳434);
    const 响应434 = await fetch(`${解码64('aHR0cHM6Ly9hcGkudW91aW4uY29tL2luZGV4LnBocC9pbmRleC9DbG91ZGZsYXJl')}?key=${请求密钥434}&time=${时间戳434}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (!响应434.ok) return [];
    const 数据434 = await 响应434.json();
    const 分组集合434 = 数据434 && 数据434.data;
    if (!分组集合434) return [];
    const 结果列表433 = [];
    for (const 分组名434 of Object.keys(分组线路映射)) {
      const 是否值6434 = 分组名434 === 'ipv6';
      if (是否值6434 && !值6已启用) continue;
      if (!是否值6434 && !值4已启用) continue;
      const 线路名434 = 分组线路映射[分组名434];
      if (线路名434 === '移动' && !值值432) continue;
      if (线路名434 === '联通' && !值值431) continue;
      if (线路名434 === '电信' && !值值430) continue;
      const 分组434 = 分组集合434[分组名434];
      const 条目列表434 = 分组434 && Array.isArray(分组434.info) ? 分组434.info : [];
      for (const 条目434 of 条目列表434) {
        const 地址434 = 规范化节点主机(条目434 && 条目434.ip);
        if (!地址434) continue;
        结果列表433.push({
          isp: 线路名434,
          ip: 地址434,
          colo: ''
        });
      }
    }
    return 结果列表433;
  } catch (事件值427) {}
  return [];
}

function 解析代理配置(地址249) {
  let 剩余地址 = String(地址249 || '').trim();
  // 按前缀识别代理种类，无前缀保持原有行为（套接字5）
  let 代理种类 = 代理种类_套接字5;
  const 小写地址 = 剩余地址.toLowerCase();
  if (小写地址.startsWith(前缀_安全超文本)) {
    代理种类 = 代理种类_安全隧道;
    剩余地址 = 剩余地址.slice(前缀_安全超文本.length);
  } else if (小写地址.startsWith(前缀_超文本)) {
    代理种类 = 代理种类_隧道;
    剩余地址 = 剩余地址.slice(前缀_超文本.length);
  } else if (小写地址.startsWith(前缀_套接字5)) {
    剩余地址 = 剩余地址.slice(前缀_套接字5.length);
  } else if (小写地址.startsWith(前缀_套接字)) {
    剩余地址 = 剩余地址.slice(前缀_套接字.length);
  }
  // 去掉可能存在的尾部路径，只留 认证@主机:端口
  const 路径位置 = 剩余地址.indexOf('/');
  if (路径位置 >= 0) 剩余地址 = 剩余地址.slice(0, 路径位置);
  if (!剩余地址) throw new Error(错误_无效代理地址);
  let [本地值248, 本地值247] = 剩余地址.split("@").reverse();
  let 本地值246, 密码245, 主机名244, 代理端口;
  if (本地值247) {
    const 本地值243 = 本地值247.split(":");
    if (本地值243.length !== 2) throw new Error(错误_无效代理地址);
    [本地值246, 密码245] = 本地值243;
  }
  const 本地值242 = 本地值248.split(":");
  const 末段值 = 本地值242.pop();
  代理端口 = Number(末段值);
  // 隧道模式允许省略端口，按明文 80 / 安全 443 兜底
  if (isNaN(代理端口)) {
    if (代理种类 === 代理种类_套接字5) throw new Error(错误_无效代理地址);
    本地值242.push(末段值);
    代理端口 = 代理种类 === 代理种类_安全隧道 ? 443 : 80;
  }
  主机名244 = 本地值242.join(":");
  if (!主机名244) throw new Error(错误_无效代理地址);
  if (主机名244.includes(":") && !/^\[.*\]$/.test(主机名244)) throw new Error(错误_无效代理地址);
  return {
    username: 本地值246,
    password: 密码245,
    hostname: 主机名244,
    socksPort: 代理端口,
    kind: 代理种类
  };
}

async function 处理订阅值(请求241, 用户240 = null) {
  if (!用户240) 用户240 = 认证令牌;
  const 网址239 = new URL(请求241.url);
  // 优先检查Cookie中的语言设置
  const 凭据头部 = 请求241.headers.get('Cookie') || '';
  let 语言来源凭据 = null;
  if (凭据头部) {
    const 本地值238 = 凭据头部.split(';').map(丙值237 => 丙值237.trim());
    for (const 凭据 of 本地值238) {
      if (凭据.startsWith('preferredLanguage=')) {
        语言来源凭据 = 凭据.split('=')[1];
        break;
      }
    }
  }
  let 是否值236 = false;
  if (语言来源凭据 === 'fa' || 语言来源凭据 === 'fa-IR') {
    是否值236 = true;
  } else if (语言来源凭据 === 'zh' || 语言来源凭据 === 'zh-CN') {
    是否值236 = false;
  } else {
    // 如果没有Cookie，使用浏览器语言检测
    const 接受语言 = 请求241.headers.get('Accept-Language') || '';
    const 浏览器语言 = 接受语言.split(',')[0].split('-')[0].toLowerCase();
    是否值236 = 浏览器语言 === 'fa' || 接受语言.includes('fa-IR') || 接受语言.includes('fa');
  }
  const 语言值 = 是否值236 ? 'fa-IR' : 'zh-CN';
  const 本地值235 = {
    zh: {
      title: 解码64('6K6i6ZiF5Lit5b+D'),
      subtitle: '多客户端支持 • 智能优选 • 一键生成',
      selectClient: '[ 选择客户端 ]',
      systemStatus: '[ 系统状态 ]',
      configManagement: '[ 配置管理 ]',
      relatedLinks: '[ 相关链接 ]',
      checking: '检测中...',
      workerRegion: 'Worker地区: ',
      detectionMethod: '检测方式: ',
      proxyIPStatus: 解码64('UHJveHlJUOeKtuaAgTog'),
      currentIP: '当前使用IP: ',
      regionMatch: '地区匹配: ',
      selectionLogic: '选择逻辑: ',
      kvStatusChecking: '检测KV状态中...',
      kvEnabled: '✅ KV存储已启用，可以使用配置管理功能',
      kvDisabled: '⚠️ KV存储未启用或未配置',
      specifyRegion: '指定地区 (wk):',
      autoDetect: 解码64('5a6Y5pa555u06L+e'),
      saveRegion: '保存地区配置',
      protocolSelection: 解码64('5Y2P6K6u6YCJ5oupOg=='),
      enableProtoV: 解码64('5ZCv55SoIFZMRVNTIOWNj+iurg=='),
      enableProtoT: 解码64('5ZCv55SoIFRyb2phbiDljY/orq4='),
      enableXhttp: 解码64('5ZCv55SoIHhodHRwIOWNj+iurg=='),
      altPassword: 解码64('VHJvamFuIOWvhueggSAo5Y+v6YCJKTo='),
      customPath: '自定义路径 (d):',
      customIP: 解码64('6Ieq5a6a5LmJUHJveHlJUCAocCk6'),
      preferredIPs: '优选IP列表 (yx):',
      preferredIPsURL: '优选IP来源URL (yxURL):',
      latencyTest: '延迟测试',
      latencyTestIP: '测试IP/域名:',
      latencyTestIPPlaceholder: '输入IP或域名，多个用逗号分隔',
      latencyTestPort: '端口:',
      startTest: '开始测试',
      stopTest: '停止测试',
      testResult: '测试结果:',
      addToYx: '添加到优选列表',
      addSelectedToYx: '添加选中项到优选列表',
      selectAll: '全选',
      deselectAll: '取消全选',
      testingInProgress: '测试中...',
      testComplete: '测试完成',
      latencyMs: '延迟',
      timeout: '超时',
      ipSource: 'IP来源:',
      manualInput: '手动输入',
      cfRandomIP: 'CF随机IP',
      urlFetch: 'URL获取',
      randomCount: '生成数量:',
      fetchURL: '获取URL:',
      fetchURLPlaceholder: '输入优选IP的URL地址',
      generateIP: '生成IP',
      fetchIP: '获取IP',
      socks5Config: 解码64('5Luj55CG6YWN572uIChzKTo='),
      customHomepage: '自定义首页URL (homepage):',
      customHomepagePlaceholder: '例如: https://example.com',
      customHomepageHint: '设置自定义URL作为首页伪装。访问根路径 / 时将显示该URL的内容。留空则显示默认终端页面。',
      saveConfig: '保存配置',
      advancedControl: '高级控制',
      subscriptionConverter: 解码64('6K6i6ZiF6L2s5o2i5Zyw5Z2AOg=='),
      builtinPreferred: '内置优选类型:',
      enablePreferredDomain: '启用优选域名',
      enablePreferredIP: '启用优选 IP',
      enableNativeAddress: '启用原生地址',
      enableGitHubPreferred: '启用自定义优选',
      jkSection: '家宽链式',
      jkEnable: '开启家宽链式',
      jkHint: 解码64('5byA5LqG5LmL5ZCO5a6i5oi356uv5YiX6KGo5aSa5LiA5Liq44CMQ0xBU0gg5a625a6944CN44CCQ0Yg6IqC54K55bim6Lev77yM5Ye65Y+j5o2i5oiQ5pel5pys44CB6Z+p5Zu9562J5Zyw55qE5a625bqt5a695bim44CC6KaBIENsYXNoIE1ldGEg5YaF5qC4IDEuMTkuMjUg5Lul5LiK5omN6K6k77yMQ2xhc2ggVmVyZ2UgUmV244CBRmxDbGFzaOOAgUNNRkEg6YO96KGM44CC6IqC54K55piv572R5Y+L5YWx5Lqr55qE77yM5pe25LiN5pe25Lya5o6J77yM6K6i6ZiF6YeM5Lya6Ieq5bex5o2i44CC'),
      jkClient: 'CLASH 家宽',
      allowAPIManagement: '允许API管理 (ae):',
      regionMatching: '地区匹配 (rm):',
      downgradeControl: 解码64('5Ye656uZ5pa55byPIChxaik6'),
      tlsControl: 'TLS控制 (dkby):',
      preferredControl: '优选控制 (yxby):',
      saveAdvanced: '保存高级配置',
      loading: '加载中...',
      currentConfig: '📍 当前路径配置',
      refreshConfig: '刷新配置',
      resetConfig: '重置配置',
      subscriptionCopied: 解码64('6K6i6ZiF6ZO+5o6l5bey5aSN5Yi2'),
      autoSubscriptionCopied: 解码64('6Ieq5Yqo6K+G5Yir6K6i6ZiF6ZO+5o6l5bey5aSN5Yi277yM5a6i5oi356uv6K6/6Zeu5pe25Lya5qC55o2uVXNlci1BZ2VudOiHquWKqOivhuWIq+W5tui/lOWbnuWvueW6lOagvOW8jw=='),
      altPasswordPlaceholder: '留空则自动使用 UUID',
      altPasswordHint: 解码64('6K6+572u6Ieq5a6a5LmJIFRyb2phbiDlr4bnoIHjgILnlZnnqbrliJnkvb/nlKggVVVJROOAguWuouaIt+err+S8muiHquWKqOWvueWvhueggei/m+ihjCBTSEEyMjQg5ZOI5biM44CC'),
      protocolHint: 解码64('5Y+v5Lul5ZCM5pe25ZCv55So5aSa5Liq5Y2P6K6u44CC6K6i6ZiF5bCG55Sf5oiQ6YCJ5Lit5Y2P6K6u55qE6IqC54K544CCPGJyPuKAoiBWTEVTUyBXUzog5Z+65LqOIFdlYlNvY2tldCDnmoTmoIflh4bljY/orq48YnI+4oCiIFRyb2phbjog5L2/55SoIFNIQTIyNCDlr4bnoIHorqTor4E8YnI+4oCiIHhodHRwOiDln7rkuo4gSFRUUCBQT1NUIOeahOS8quijheWNj+iuru+8iOmcgOimgee7keWumuiHquWumuS5ieWfn+WQjeW5tuW8gOWQryBnUlBD77yJ'),
      enableECH: '启用 ECH (Encrypted Client Hello)',
      enableECHHint: 解码64('5ZCv55So5ZCO77yM5q+P5qyh5Yi35paw6K6i6ZiF5pe25Lya6Ieq5Yqo5LuOIERvSCDojrflj5bmnIDmlrDnmoQgRUNIIOmFjee9ruW5tua3u+WKoOWIsOmTvuaOpeS4rQ=='),
      customDNS: '自定义 DNS 服务器',
      customDNSPlaceholder: '例如: https://223.5.5.5/dns-query',
      customDNSHint: '用于ECH配置查询的DNS服务器地址（DoH格式）',
      customECHDomain: '自定义 ECH 域名',
      customECHDomainPlaceholder: '例如: cloudflare-ech.com',
      customECHDomainHint: 'ECH配置中使用的域名，留空则使用默认值',
      alpn: 'TLS ALPN',
      alpnDefault: '默认（留空，由客户端协商）',
      alpnHint: '仅添加到 TLS 节点链接参数；留空则不写 alpn。',
      saveProtocol: 解码64('5L+d5a2Y5Y2P6K6u6YWN572u'),
      subscriptionConverterPlaceholder: '默认: https://url.v1.mk/sub',
      subscriptionConverterHint: 解码64('6K6i6ZiF6L2s5o2i5bey5YaF6YOo5a6e546w77yM5peg6ZyA5aSW6YOoIEFQSeOAguatpOmhueS7heS9nOWFvOWuueS/neeVme+8jOWPr+eVmeepuuOAgg=='),
      builtinPreferredHint: 解码64('5o6n5Yi26K6i6ZiF5Lit5YyF5ZCr5ZOq5Lqb5YaF572u5LyY6YCJ6IqC54K544CC6buY6K6k5YWo6YOo5ZCv55So44CC'),
      apiEnabledDefault: '默认（关闭API）',
      apiEnabledYes: '开启API管理',
      apiEnabledHint: '⚠️ 安全提醒：开启后允许通过API动态添加优选IP。建议仅在需要时开启。',
      regionMatchingDefault: '默认（启用地区匹配）',
      regionMatchingNo: '关闭地区匹配',
      regionMatchingHint: '设置为"关闭"时不进行地区智能匹配',
      downgradeControlDefault: 解码64('5LyY5YWI6LWw5Luj55CG77yI6buY6K6k77yJ'),
      downgradeControlNo: 解码64('5LyY5YWI55u06L+e77yM5aSx6LSl5YaN6LWw5Luj55CG'),
      downgradeControlOnly: 解码64('5Y+q6LWw5Luj55CG77yM5LiN5Zue6JC9'),
      downgradeControlHint: 解码64('5rKh5aGr5Luj55CG5pe25LiJ5Liq6YCJ6aG56YO95LiA5qC377yM6YO95piv55u06L+e44CC5Y+q6LWw5Luj55CG5pe26L+e5LiN5LiK5bCx5pat5byA77yM5Ye65Y+jIElQIOS4jeS8mua8jw=='),
      tlsControlDefault: '默认（保留所有节点）',
      tlsControlYes: '仅TLS节点',
      tlsControlHint: '设置为"仅TLS节点"时只生成带TLS的节点，不生成非TLS节点（如80端口）',
      preferredControlDefault: '默认（启用优选）',
      preferredControlYes: '关闭优选',
      preferredControlHint: '设置为"关闭优选"时只使用原生地址，不生成优选IP和域名节点',
      regionNames: {
        CF: 解码64('8J+MkCDlrpjmlrnnm7Tov54='),
        HK: '🇭🇰 香港',
        US: '🇺🇸 美国',
        SG: '🇸🇬 新加坡',
        JP: '🇯🇵 日本',
        KR: '🇰🇷 韩国',
        DE: '🇩🇪 德国',
        SE: '🇸🇪 瑞典',
        NL: '🇳🇱 荷兰',
        FI: '🇫🇮 芬兰',
        GB: '🇬🇧 英国'
      },
      terminal: '终端 v3.1',
      githubProject: 'GitHub 项目',
      优选工具: '优选工具',
      autoDetectClient: '自动识别',
      selectionLogicText: '同地区 → 邻近地区 → 其他地区',
      customIPDisabledHint: 解码64('5L2/55So6Ieq5a6a5LmJUHJveHlJUOaXtu+8jOWcsOWMuumAieaLqeW3suemgeeUqA=='),
      customIPMode: 解码64('6Ieq5a6a5LmJUHJveHlJUOaooeW8jyAocOWPmOmHj+WQr+eUqCk='),
      customIPModeDesc: '自定义IP模式 (已禁用地区匹配)',
      usingCustomProxyIP: 解码64('5L2/55So6Ieq5a6a5LmJUHJveHlJUDog'),
      customIPConfig: ' (p变量配置)',
      customIPModeDisabled: '自定义IP模式，地区选择已禁用',
      manualRegion: '手动指定地区',
      manualRegionDesc: ' (手动指定)',
      proxyIPAvailable: 解码64('MTAvMTAg5Y+v55SoIChQcm94eUlQ5Z+f5ZCN6aKE6K6+5Y+v55SoKQ=='),
      smartSelection: '智能就近选择中',
      sameRegionIP: '同地区IP可用 (1个)',
      cloudflareDetection: 解码64('5a6Y5pa555u06L+e'),
      detectionFailed: '检测失败',
      apiTestResult: 'API检测结果: ',
      apiTestTime: '检测时间: ',
      apiTestFailed: 'API检测失败: ',
      unknownError: '未知错误',
      apiTestError: 'API测试失败: ',
      kvNotConfigured: 'KV存储未配置，无法使用配置管理功能。\\n\\n请在Cloudflare Workers中:\\n1. 创建KV命名空间\\n2. 绑定环境变量 C\\n3. 重新部署代码',
      kvNotEnabled: 'KV存储未配置',
      kvCheckFailed: 'KV存储检测失败: 响应格式错误',
      kvCheckFailedStatus: 'KV存储检测失败 - 状态码: ',
      kvCheckFailedError: 'KV存储检测失败 - 错误: '
    },
    fa: {
      title: 'مرکز اشتراک',
      subtitle: 'پشتیبانی چند کلاینت • انتخاب هوشمند • تولید یک کلیکی',
      selectClient: '[ انتخاب کلاینت ]',
      systemStatus: '[ وضعیت سیستم ]',
      configManagement: '[ مدیریت تنظیمات ]',
      relatedLinks: '[ لینک‌های مرتبط ]',
      checking: 'در حال بررسی...',
      workerRegion: 'منطقه Worker: ',
      detectionMethod: 'روش تشخیص: ',
      proxyIPStatus: 解码64('2YjYtti524zYqiBQcm94eUlQOiA='),
      currentIP: 'IP فعلی: ',
      regionMatch: 'تطبیق منطقه: ',
      selectionLogic: 'منطق انتخاب: ',
      kvStatusChecking: 'در حال بررسی وضعیت KV...',
      kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
      kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
      specifyRegion: 'تعیین منطقه (wk):',
      autoDetect: 'اتصال مستقیم رسمی',
      saveRegion: 'ذخیره تنظیمات منطقه',
      protocolSelection: 'انتخاب پروتکل:',
      enableProtoV: 解码64('2YHYudin2YTigIzYs9in2LLbjCDZvtix2YjYqtqp2YQgVkxFU1M='),
      enableProtoT: 解码64('2YHYudin2YTigIzYs9in2LLbjCDZvtix2YjYqtqp2YQgVHJvamFu'),
      enableXhttp: 'فعال‌سازی پروتکل xhttp',
      enableECH: 'فعال‌سازی ECH (Encrypted Client Hello)',
      enableECHHint: 'پس از فعال‌سازی، در هر بار تازه‌سازی اشتراک، پیکربندی ECH به‌روز به‌طور خودکار از DoH دریافت شده و به لینک‌ها اضافه می‌شود',
      customDNS: 'سرور DNS سفارشی',
      customDNSPlaceholder: 'مثال: https://223.5.5.5/dns-query',
      customDNSHint: 'آدرس سرور DNS برای جستجوی پیکربندی ECH (فرمت DoH)',
      customECHDomain: 'دامنه ECH سفارشی',
      customECHDomainPlaceholder: 'مثال: cloudflare-ech.com',
      customECHDomainHint: 'دامنه استفاده شده در پیکربندی ECH، خالی بگذارید تا از مقدار پیش‌فرض استفاده شود',
      altPassword: 解码64('2LHZhdiyINi52KjZiNixIFRyb2phbiAo2KfYrtiq24zYp9ix24wpOg=='),
      customPath: 'مسیر سفارشی (d):',
      customIP: 解码64('UHJveHlJUCDYs9mB2KfYsdi024wgKHApOg=='),
      preferredIPs: 'لیست IP ترجیحی (yx):',
      preferredIPsURL: 'URL منبع IP ترجیحی (yxURL):',
      latencyTest: 'تست تاخیر',
      latencyTestIP: 'IP/دامنه تست:',
      latencyTestIPPlaceholder: 'IP یا دامنه وارد کنید، چند مورد با کاما جدا شوند',
      latencyTestPort: 'پورت:',
      startTest: 'شروع تست',
      stopTest: 'توقف تست',
      testResult: 'نتیجه تست:',
      addToYx: 'افزودن به لیست ترجیحی',
      addSelectedToYx: 'افزودن موارد انتخاب شده',
      selectAll: 'انتخاب همه',
      deselectAll: 'لغو انتخاب',
      testingInProgress: 'در حال تست...',
      testComplete: 'تست کامل شد',
      latencyMs: 'تاخیر',
      timeout: 'زمان تمام شد',
      ipSource: 'منبع IP:',
      manualInput: 'ورودی دستی',
      cfRandomIP: 'IP تصادفی CF',
      urlFetch: 'دریافت از URL',
      randomCount: 'تعداد تولید:',
      fetchURL: 'URL دریافت:',
      fetchURLPlaceholder: 'آدرس URL لیست IP را وارد کنید',
      generateIP: 'تولید IP',
      fetchIP: 'دریافت IP',
      socks5Config: 解码64('2KrZhti424zZhdin2Kog2b7YsdmI2qnYs9uMIChzKTo='),
      customHomepage: 'URL صفحه اصلی سفارشی (homepage):',
      customHomepagePlaceholder: 'مثال: https://example.com',
      customHomepageHint: 'تنظیم URL سفارشی به عنوان استتار صفحه اصلی. هنگام دسترسی به مسیر اصلی / محتوای این URL نمایش داده می‌شود. اگر خالی بگذارید صفحه ترمینال پیش‌فرض نمایش داده می‌شود.',
      saveConfig: 'ذخیره تنظیمات',
      advancedControl: 'کنترل پیشرفته',
      subscriptionConverter: 'آدرس تبدیل اشتراک:',
      builtinPreferred: 'نوع ترجیحی داخلی:',
      enablePreferredDomain: 'فعال‌سازی دامنه ترجیحی',
      enablePreferredIP: 'فعال‌سازی IP ترجیحی',
      enableNativeAddress: 'فعال‌سازی آدرس اصلی',
      enableGitHubPreferred: 'فعال‌سازی ترجیح سفارشی',
      jkSection: 'زنجیره اینترنت خانگی',
      jkEnable: 'فعال‌سازی زنجیره اینترنت خانگی',
      jkHint: 解码64('2b7YsyDYp9iyINmB2LnYp9mE4oCM2LPYp9iy24zYjCDar9iy24zZhtmHIMKrQ0xBU0gg2K7Yp9mG2q/bjMK7INio2Ycg2YHZh9ix2LPYqiDaqdmE2KfbjNmG2KrigIzZh9inINin2LbYp9mB2Ycg2YXbjOKAjNi02YjYry4g2q/YsdmH4oCM2YfYp9uMIENGINmF2LPbjNixINix2Kcg2KjYp9iyINmF24zigIzaqdmG2YbYryDZiCDYrtix2YjYrNuMINin2LIg2KfbjNmG2KrYsdmG2Kog2K7Yp9mG2q/bjCDamNin2b7ZhtiMINqp2LHZhyDZiCDaqdi02YjYsdmH2KfbjCDYr9uM2q/YsSDYp9iz2KouINmB2YLYtyDZh9iz2KrZhyBDbGFzaCBNZXRhINmG2LPYrtmHIDEuMTkuMjUg2KjZhyDYqNin2YTYpyDYotmGINix2Kcg2YXbjOKAjNi02YbYp9iz2K/YmyBDbGFzaCBWZXJnZSBSZXbYjCBGbENsYXNoINmIIENNRkEg2qnYp9ixINmF24zigIzaqdmG2YbYry4g2q/YsdmH4oCM2YfYpyDYp9i02KrYsdin2qnbjCDZh9iz2KrZhtivINmIINqv2KfZh9uMINmC2LfYuSDZhduM4oCM2LTZiNmG2K/YjCDYp9i02KrYsdin2qkg2K7ZiNiv2LQg2q/YsdmHINiv24zar9ix24wg2LHYpyDYp9mG2KrYrtin2Kgg2YXbjOKAjNqp2YbYry4='),
      jkClient: 'CLASH خانگی',
      allowAPIManagement: 'اجازه مدیریت API (ae):',
      regionMatching: 'تطبیق منطقه (rm):',
      downgradeControl: 解码64('2LHZiNi0INiu2LHZiNisIChxaik6'),
      tlsControl: 'کنترل TLS (dkby):',
      preferredControl: 'کنترل ترجیحی (yxby):',
      saveAdvanced: 'ذخیره تنظیمات پیشرفته',
      loading: 'در حال بارگذاری...',
      currentConfig: '📍 پیکربندی مسیر فعلی',
      refreshConfig: 'تازه‌سازی تنظیمات',
      resetConfig: 'بازنشانی تنظیمات',
      subscriptionCopied: 'لینک اشتراک کپی شد',
      autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند',
      altPasswordPlaceholder: 'خالی بگذارید تا از UUID استفاده شود',
      altPasswordHint: 解码64('2LHZhdiyINi52KjZiNixIFRyb2phbiDYs9mB2KfYsdi024wg2LHYpyDYqtmG2LjbjNmFINqp2YbbjNivLiDYp9qv2LEg2K7Yp9mE24wg2Kjar9iw2KfYsduM2K8g2KfYsiBVVUlEINin2LPYqtmB2KfYr9mHINmF24zigIzYtNmI2K8uINqp2YTYp9uM2YbYqiDYqNmHINi32YjYsSDYrtmI2K/aqdin2LEg2LHZhdiyINi52KjZiNixINix2Kcg2KjYpyBTSEEyMjQg2YfYtCDZhduM4oCM2qnZhtivLg=='),
      protocolHint: 解码64('2YXbjOKAjNiq2YjYp9mG24zYryDahtmG2K/bjNmGINm+2LHZiNiq2qnZhCDYsdinINmH2YXYstmF2KfZhiDZgdi52KfZhCDaqdmG24zYry4g2KfYtNiq2LHYp9qpINqv2LHZh+KAjNmH2KfbjCDZvtix2YjYqtqp2YTigIzZh9in24wg2KfZhtiq2K7Yp9ioINi02K/ZhyDYsdinINiq2YjZhNuM2K8g2YXbjOKAjNqp2YbYry48YnI+4oCiIFZMRVNTIFdTOiDZvtix2YjYqtqp2YQg2KfYs9iq2KfZhtiv2KfYsdivINmF2KjYqtmG24wg2KjYsSBXZWJTb2NrZXQ8YnI+4oCiIFRyb2phbjog2KfYrdix2KfYsiDZh9mI24zYqiDYqNinINix2YXYsiDYudio2YjYsSBTSEEyMjQ8YnI+4oCiIHhodHRwOiDZvtix2YjYqtqp2YQg2KfYs9iq2KrYp9ixINmF2KjYqtmG24wg2KjYsSBIVFRQIFBPU1QgKNmG24zYp9iyINio2Ycg2KfYqti12KfZhCDYr9in2YXZhtmHINiz2YHYp9ix2LTbjCDZiCDZgdi52KfZhOKAjNiz2KfYstuMIGdSUEMg2K/Yp9ix2K8p'),
      alpn: 'TLS ALPN',
      alpnDefault: 'پیش‌فرض (خالی، مذاکره توسط کلاینت)',
      alpnHint: 'فقط به لینک‌های TLS اضافه می‌شود؛ اگر خالی باشد alpn نوشته نمی‌شود.',
      saveProtocol: 'ذخیره تنظیمات پروتکل',
      subscriptionConverterPlaceholder: 'پیش‌فرض: https://url.v1.mk/sub',
      subscriptionConverterHint: 'تبدیل اشتراک به صورت داخلی پیاده‌سازی شده است و نیازی به API خارجی ندارد. این فیلد فقط برای سازگاری حفظ شده و می‌توان آن را خالی گذاشت.',
      builtinPreferredHint: 'کنترل اینکه کدام گره‌های ترجیحی داخلی در اشتراک گنجانده شوند. به طور پیش‌فرض همه فعال هستند.',
      apiEnabledDefault: 'پیش‌فرض (بستن API)',
      apiEnabledYes: 'فعال‌سازی مدیریت API',
      apiEnabledHint: '⚠️ هشدار امنیتی: فعال‌سازی این گزینه اجازه می‌دهد IP های ترجیحی از طریق API به طور پویا اضافه شوند. توصیه می‌شود فقط در صورت نیاز فعال کنید.',
      regionMatchingDefault: 'پیش‌فرض (فعال‌سازی تطبیق منطقه)',
      regionMatchingNo: 'بستن تطبیق منطقه',
      regionMatchingHint: 'وقتی "بستن" تنظیم شود، تطبیق هوشمند منطقه انجام نمی‌شود',
      downgradeControlDefault: 解码64('2KfZiNmE2YjbjNiqINio2Kcg2b7YsdmI2qnYs9uMICjZvtuM2LTigIzZgdix2LYp'),
      downgradeControlNo: 解码64('2KfZiNmE2YjbjNiqINio2Kcg2KfYqti12KfZhCDZhdiz2KrZgtuM2YXYjCDYr9ixINi12YjYsdiqINiu2LfYpyDZvtix2Yjaqdiz24w='),
      downgradeControlOnly: 解码64('2YHZgti3INm+2LHZiNqp2LPbjNiMINio2K/ZiNmGINio2KfYstqv2LTYqg=='),
      downgradeControlHint: 解码64('2Kfar9ixINm+2LHZiNqp2LPbjCDYqtmG2LjbjNmFINmG2LTYr9mHINio2KfYtNivINmH2LEg2LPZhyDar9iy24zZhtmHINuM2qnYs9in2YYg2Ygg2YXYs9iq2YLbjNmFINmH2LPYqtmG2K8uINiv2LEg2K3Yp9mE2Kog2YHZgti3INm+2LHZiNqp2LPbjNiMINin2KrYtdin2YQg2YbYp9mF2YjZgdmCINmC2LfYuSDZhduM4oCM2LTZiNivINmIIElQINiu2LHZiNis24wg2YHYp9i0INmG2YXbjOKAjNi02YjYrw=='),
      tlsControlDefault: 'پیش‌فرض (حفظ همه گره‌ها)',
      tlsControlYes: 'فقط گره‌های TLS',
      tlsControlHint: 'وقتی "فقط گره‌های TLS" تنظیم شود، فقط گره‌های با TLS تولید می‌شوند، گره‌های غیر TLS (مانند پورت 80) تولید نمی‌شوند',
      preferredControlDefault: 'پیش‌فرض (فعال‌سازی ترجیح)',
      preferredControlYes: 'بستن ترجیح',
      preferredControlHint: 'وقتی "بستن ترجیح" تنظیم شود، فقط از آدرس اصلی استفاده می‌شود، گره‌های IP و دامنه ترجیحی تولید نمی‌شوند',
      regionNames: {
        CF: '🌐 مستقیم رسمی',
        HK: '🇭🇰 هنگ کنگ',
        US: '🇺🇸 آمریکا',
        SG: '🇸🇬 سنگاپور',
        JP: '🇯🇵 ژاپن',
        KR: '🇰🇷 کره جنوبی',
        DE: '🇩🇪 آلمان',
        SE: '🇸🇪 سوئد',
        NL: '🇳🇱 هلند',
        FI: '🇫🇮 فنلاند',
        GB: '🇬🇧 بریتانیا'
      },
      terminal: 'ترمینال v3.1',
      githubProject: 'پروژه GitHub',
      优选工具: 'ابزار ترجیح IP',
      autoDetectClient: 'تشخیص خودکار',
      selectionLogicText: 'هم‌منطقه → منطقه مجاور → سایر مناطق',
      customIPDisabledHint: 解码64('2YfZhtqv2KfZhSDYp9iz2KrZgdin2K/ZhyDYp9iyIFByb3h5SVAg2LPZgdin2LHYtNuM2Iwg2KfZhtiq2K7Yp9ioINmF2YbYt9mC2Ycg2LrbjNix2YHYudin2YQg2KfYs9iq'),
      customIPMode: 解码64('2K3Yp9mE2KogUHJveHlJUCDYs9mB2KfYsdi024wgKNmF2KrYutuM2LEgcCDZgdi52KfZhCDYp9iz2Kop'),
      customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
      usingCustomProxyIP: 解码64('2KfYs9iq2YHYp9iv2Ycg2KfYsiBQcm94eUlQINiz2YHYp9ix2LTbjDog'),
      customIPConfig: ' (پیکربندی متغیر p)',
      customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
      manualRegion: 'تعیین منطقه دستی',
      manualRegionDesc: ' (تعیین دستی)',
      proxyIPAvailable: 解码64('MTAvMTAg2K/YsSDYr9iz2KrYsdizICjYr9in2YXZhtmHINm+24zYtOKAjNmB2LHYtiBQcm94eUlQINiv2LEg2K/Ys9iq2LHYsyDYp9iz2Kop'),
      smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
      sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
      cloudflareDetection: 'اتصال مستقیم رسمی',
      detectionFailed: 'تشخیص ناموفق',
      apiTestResult: 'نتیجه تشخیص API: ',
      apiTestTime: 'زمان تشخیص: ',
      apiTestFailed: 'تشخیص API ناموفق: ',
      unknownError: 'خطای ناشناخته',
      apiTestError: 'تست API ناموفق: ',
      kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است، نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
      kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
      kvCheckFailed: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
      kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
      kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
    }
  };
  const 翻译值 = 本地值235[是否值236 ? 'fa' : 'zh'];
  const 值页面 = `<!DOCTYPE html>
    <html lang="${语言值}" dir="${是否值236 ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${翻译值.title}</title>

    </head>
    <body>
        <div class="matrix-bg"></div>
        <div class="matrix-code-rain" id="matrixCodeRain"></div>
            <div class="cp-hud">
                <span class="cp-hud-line"><span class="cp-hud-label">SYS::</span> ${翻译值.terminal}</span>
                <span class="cp-hud-line"><span class="cp-hud-label">NODE::</span> NIGHT_CITY</span>
                <span class="cp-hud-line"><span class="cp-hud-label">LINK::</span> SECURE / ENC</span>
            </div>
            <div class="cp-lang-wrapper">
                <span class="cp-lang-tag">LANG_</span>
                <select id="languageSelector" onchange="切换语言(this.value)">
                    <option value="zh" ${!是否值236 ? 'selected' : ''}>🇨🇳 中文</option>
                    <option value="fa" ${是否值236 ? 'selected' : ''}>🇮🇷 فارسی</option>
                </select>
            </div>
            <button type="button" id="cpFxToggle" class="cp-fx-toggle" onclick="window.切换页面特效()" title="${是否值236 ? 'تغییر افکت‌های صفحه' : '切换页面特效'}" aria-label="FX toggle">
                <span class="cp-fx-dot" aria-hidden="true"></span>
                <span id="cpFxLabel">FX: ON</span>
            </button>
        <div class="container">
            <div class="header">
                    <h1 class="title cp-glitch" data-text="${翻译值.title}">${翻译值.title}</h1>
                    <p class="subtitle">${翻译值.subtitle}</p>
            </div>
            <div class="card">
                    <h2 class="card-title">${翻译值.selectClient}</h2>
                <div class="client-grid">
                    <button class="client-btn" onclick="生成客户端链接(atob('Y2xhc2g='), 'CLASH')">CLASH</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('Y2xhc2g='), 'STASH')">STASH</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('c3VyZ2U='), 'SURGE')">SURGE</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('c2luZ2JveA=='), 'SING-BOX')">SING-BOX</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('bG9vbg=='), 'LOON')">LOON</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('cXVhbng='), 'QUANTUMULT X')">QUANTUMULT X</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('djJyYXk='), 'V2RAY')">V2RAY</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('djJyYXk='), 'V2RAYNG')">V2RAYNG</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('djJyYXk='), 'NEKORAY')">NEKORAY</button>
                    <button class="client-btn" onclick="生成客户端链接(atob('djJyYXk='), 'Shadowrocket')">Shadowrocket</button>
                    <button class="client-btn" id="jkClientBtn" style="${启用家宽链式 ? '' : 'display: none;'}" onclick="生成客户端链接('vg', '${翻译值.jkClient}')">${翻译值.jkClient}</button>
                </div>
                <div class="subscription-url" id="clientSubscriptionUrl"></div>
            </div>
            <div class="card">
                    <h2 class="card-title">${翻译值.systemStatus}</h2>
                <div id="systemStatus" style="margin: 20px 0; padding: 15px; background: rgba(8, 4, 28, 0.8); border: 2px solid #00f0ff; box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1); position: relative; overflow: hidden;">
                        <div style="color: #00f0ff; margin-bottom: 15px; font-weight: bold; text-shadow: 0 0 5px #00f0ff;">[ ${翻译值.checking} ]</div>
                        <div id="regionStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00f0ff;">${翻译值.workerRegion}${翻译值.checking}</div>
                        <div id="geoInfo" style="margin: 8px 0; color: #7aa9c4; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #7aa9c4;">${翻译值.detectionMethod}${翻译值.checking}</div>
                        <div id="backupStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00f0ff;">${翻译值.proxyIPStatus}${翻译值.checking}</div>
                        <div id="currentIP" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00f0ff;">${翻译值.currentIP}${翻译值.checking}</div>
                        <div id="echStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00f0ff; font-size: 0.9rem;">ECH状态: ${翻译值.checking}</div>
                        <div id="regionMatch" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; text-shadow: 0 0 3px #00f0ff;">${翻译值.regionMatch}${翻译值.checking}</div>
                        <div id="selectionLogic" style="margin: 8px 0; color: #7aa9c4; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #7aa9c4;">${翻译值.selectionLogic}${翻译值.selectionLogicText}</div>
                </div>
            </div>
            <div class="card" id="configCard" style="display: none;">
                    <h2 class="card-title">${翻译值.configManagement}</h2>
                <div id="kvStatus" style="margin-bottom: 20px; padding: 10px; background: rgba(8, 4, 28, 0.8); border: 1px solid #00f0ff; color: #00f0ff;">
                    ${翻译值.kvStatusChecking}
                </div>
                <div id="configContent" style="display: none;">
                    <form id="regionForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.specifyRegion}</label>
                            <select id="wkRegion" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.autoDetect}</option>
                                    <option value="HK">${翻译值.regionNames.HK}</option>
                                    <option value="US">${翻译值.regionNames.US}</option>
                                    <option value="SG">${翻译值.regionNames.SG}</option>
                                    <option value="JP">${翻译值.regionNames.JP}</option>
                                    <option value="KR">${翻译值.regionNames.KR}</option>
                                    <option value="DE">${翻译值.regionNames.DE}</option>
                                    <option value="SE">${翻译值.regionNames.SE}</option>
                                    <option value="NL">${翻译值.regionNames.NL}</option>
                                    <option value="FI">${翻译值.regionNames.FI}</option>
                                    <option value="GB">${翻译值.regionNames.GB}</option>
                            </select>
                                <small id="wkRegionHint" style="color: #7aa9c4; font-size: 0.85rem; display: none;">⚠️ ${翻译值.customIPDisabledHint}</small>
                        </div>
                    </form>
                    <form id="otherConfigForm" style="margin-bottom: 20px;">
                        <div class="cp-cpu-setting">
                            <label class="cp-cpu-switch" for="freeCpu">
                                <input type="checkbox" id="freeCpu" aria-describedby="freeCpuHint" ${supportsFreeCpu ? '' : 'disabled'}>
                                <span>Free CPU 保护</span>
                            </label>
                            <small id="freeCpuHint">${supportsFreeCpu ? '单连接上下载合计最多 384 KiB 或 96 个数据块，超过就断开。客户端需自行重连，下载和视频可能中断。保存后对新连接生效，不能保证零超限。' : '当前内核不支持，请先更新配套内核。'}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.protocolSelection}</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ev" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enableProtoV}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="et" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enableProtoT}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ex" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enableXhttp}</span>
                                    </label>
                                </div>
                                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ech" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                                <span style="font-size: 1.1rem;">${翻译值.enableECH}</span>
                                        </label>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px; margin-left: 26px;">${翻译值.enableECHHint}</small>
                                    </div>
                                    <div style="margin-top: 15px; margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${翻译值.customDNS}</label>
                                        <input type="text" id="customDNS" placeholder="${翻译值.customDNSPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${翻译值.customDNSHint}</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${翻译值.customECHDomain}</label>
                                        <input type="text" id="customECHDomain" placeholder="${翻译值.customECHDomainPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${翻译值.customECHDomainHint}</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${翻译值.alpn}</label>
                                        <select id="alpn" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                            <option value="">${翻译值.alpnDefault}</option>
                                            <option value="h3">h3</option>
                                            <option value="h2">h2</option>
                                            <option value="http/1.1">http/1.1</option>
                                            <option value="h3,h2">h3,h2</option>
                                            <option value="h2,http/1.1">h2,http/1.1</option>
                                            <option value="h3,h2,http/1.1">h3,h2,http/1.1</option>
                                        </select>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${翻译值.alpnHint}</small>
                                    </div>
                                </div>
                                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${翻译值.altPassword}</label>
                                        <input type="text" id="tp" placeholder="${翻译值.altPasswordPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${翻译值.altPasswordHint}</small>
                                </div>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${翻译值.protocolHint}</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.customHomepage}</label>
                                <input type="text" id="customHomepage" placeholder="${翻译值.customHomepagePlaceholder}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.customHomepageHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.customPath}</label>
                                <input type="text" id="customPath" placeholder="${是否值236 ? 'مثال: /mypath یا خالی بگذارید تا از UUID استفاده شود' : '例如: /mypath 或留空使用 UUID'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${是否值236 ? 解码64('2YXYs9uM2LEg2KfYtNiq2LHYp9qpINiz2YHYp9ix2LTbjC4g2Kfar9ixINiu2KfZhNuMINio2q/YsNin2LHbjNivINin2LIgVVVJRCDYqNmHINi52YbZiNin2YYg2YXYs9uM2LEg2KfYs9iq2YHYp9iv2Ycg2YXbjOKAjNi02YjYry4=') : 解码64('6Ieq5a6a5LmJ6K6i6ZiF6Lev5b6E44CC55WZ56m65YiZ5L2/55SoIFVVSUQg5L2c5Li66Lev5b6E44CC')}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.customIP}</label>
                                <input type="text" id="customIP" placeholder="${是否值236 ? 'مثال: 1.2.3.4:443' : '例如: 1.2.3.4:443'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${是否值236 ? 解码64('2KLYr9ix2LMg2Ygg2b7ZiNix2KogUHJveHlJUCDYs9mB2KfYsdi024w=') : 解码64('6Ieq5a6a5LmJUHJveHlJUOWcsOWdgOWSjOerr+WPow==')}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.preferredIPs}</label>
                                <textarea id="yx" rows="8" spellcheck="false" placeholder="104.16.1.1:443#日本节点&#10;[2606:4700::1111]:443#IPv6节点&#10;example.com:8443#域名节点" style="width: 100%; min-height: 180px; resize: vertical; line-height: 1.6; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;"></textarea>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${是否值236 ? 'فرمت: IP:پورت#نام گره یا IP:پورت (بدون # از نام پیش‌فرض استفاده می‌شود). پشتیبانی از چندین مورد، با خط جدید یا کاما جدا می‌شوند. <span style="color: #ffb400;">IP های اضافه شده از طریق API به طور خودکار در اینجا نمایش داده می‌شوند.</span>' : '格式: IP:端口#节点名称 或 IP:端口 (无#则使用默认名称)。每行一个，也支持英文逗号分隔。<span style="color: #ffb400;">API添加的IP会自动显示在这里。</span>'}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.preferredIPsURL}</label>
                                <input type="text" id="yxURL" placeholder="${是否值236 ? 'URL منبع لیست IP ترجیحی را وارد کنید' : '输入优选IP列表来源URL'}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${是否值236 ? 'URL منبع لیست IP ترجیحی سفارشی، اگر خالی بگذارید از آدرس پیش‌فرض استفاده می‌شود' : '自定义优选IP列表来源URL，留空则使用默认地址'}</small>
                        </div>
                        
                        <div style="margin-bottom: 20px; padding: 15px; background: rgba(20, 5, 50, 0.6); border: 2px solid #7aa9c4; border-radius: 8px;">
                            <h4 style="color: #00f0ff; margin: 0 0 15px 0; font-size: 1.1rem; text-shadow: 0 0 5px #00f0ff;">⚡ ${翻译值.latencyTest}</h4><small style="color:#7aa9c4">检测可用性；延迟按面板服务器位置测得。</small>
                            <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
                                <div style="min-width: 120px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${翻译值.ipSource}</label>
                                    <select id="ipSourceSelect" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px; cursor: pointer;">
                                        <option value="manual">${翻译值.manualInput}</option>
                                        <option value="cfRandom">${翻译值.cfRandomIP}</option>
                                        <option value="urlFetch">${翻译值.urlFetch}</option>
                                    </select>
                                </div>
                                <div style="width: 100px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${翻译值.latencyTestPort}</label>
                                    <input type="number" id="latencyTestPort" value="443" min="1" max="65535" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                                <div id="randomCountDiv" style="width: 100px; display: none;">
                                    <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${翻译值.randomCount}</label>
                                    <input type="number" id="randomIPCount" value="20" min="1" max="100" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                                <div style="width: 80px;">
                                    <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${是否值236 ? 'رشته‌ها' : '线程'}</label>
                                    <input type="number" id="testThreads" value="5" min="1" max="50" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                </div>
                            </div>
                            <div id="manualInputDiv" style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${翻译值.latencyTestIP}</label>
                                <input type="text" id="latencyTestInput" placeholder="${翻译值.latencyTestIPPlaceholder}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                            </div>
                            <div id="urlFetchDiv" style="margin-bottom: 10px; display: none;">
                                <label style="display: block; margin-bottom: 5px; color: #00f0ff; font-size: 0.9rem;">${翻译值.fetchURL}</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="text" id="fetchURLInput" placeholder="${翻译值.fetchURLPlaceholder}" style="flex: 1; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                    <button type="button" id="fetchIPBtn" style="background: rgba(0, 200, 255, 0.2); border: 1px solid #00aaff; padding: 8px 16px; color: #00aaff; font-family: 'Courier New', monospace; cursor: pointer; white-space: nowrap;">⬇ ${翻译值.fetchIP}</button>
                                </div>
                            </div>
                            <div id="cfRandomDiv" style="margin-bottom: 10px; display: none;">
                                <button type="button" id="generateCFIPBtn" style="background: rgba(0, 240, 255, 0.15); border: 1px solid #00f0ff; padding: 10px 20px; color: #00f0ff; font-family: 'Courier New', monospace; cursor: pointer; width: 100%; transition: all 0.3s;">🎲 ${翻译值.generateIP}</button>
                            </div>
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <button type="button" id="startLatencyTest" style="background: rgba(0, 240, 255, 0.2); border: 1px solid #00f0ff; padding: 8px 16px; color: #00f0ff; font-family: 'Courier New', monospace; cursor: pointer; transition: all 0.3s;">▶ ${翻译值.startTest}</button>
                                <button type="button" id="stopLatencyTest" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff3860; padding: 8px 16px; color: #ff3860; font-family: 'Courier New', monospace; cursor: pointer; display: none; transition: all 0.3s;">⏹ ${翻译值.stopTest}</button>
                            </div>
                            <div id="latencyTestStatus" style="color: #7aa9c4; font-size: 0.9rem; margin-bottom: 10px; display: none;"></div>
                            <div id="latencyTestResults" style="max-height: 250px; overflow-y: auto; display: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <span style="color: #00f0ff; font-weight: bold;">${翻译值.testResult}</span>
                                    <div style="display: flex; gap: 8px;">
                                        <button type="button" id="selectAllResults" style="background: transparent; border: 1px solid #7aa9c4; padding: 4px 10px; color: #7aa9c4; font-size: 0.8rem; cursor: pointer;">${翻译值.selectAll}</button>
                                        <button type="button" id="deselectAllResults" style="background: transparent; border: 1px solid #7aa9c4; padding: 4px 10px; color: #7aa9c4; font-size: 0.8rem; cursor: pointer;">${翻译值.deselectAll}</button>
                                    </div>
                                </div>
                                <div id="cityFilterContainer" style="margin-bottom: 10px; padding: 10px; background: rgba(15, 3, 40, 0.6); border: 1px solid #7aa9c4; border-radius: 4px; display: none;">
                                    <div style="margin-bottom: 8px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff; font-size: 0.9rem;">
                                            <input type="radio" name="cityFilterMode" value="all" checked style="margin-right: 6px; width: 16px; height: 16px; cursor: pointer;">
                                            <span>${是否值236 ? '全部城市' : '全部城市'}</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff; font-size: 0.9rem; margin-left: 15px;">
                                            <input type="radio" name="cityFilterMode" value="fastest10" style="margin-right: 6px; width: 16px; height: 16px; cursor: pointer;">
                                            <span>${是否值236 ? '只选择最快的10个' : '只选择最快的10个'}</span>
                                        </label>
                                    </div>
                                    <div id="cityCheckboxesContainer" style="display: flex; flex-wrap: wrap; gap: 8px; max-height: 80px; overflow-y: auto; padding: 5px;"></div>
                                </div>
                                <div id="latencyResultsList" style="background: rgba(0, 0, 0, 0.5); border: 1px solid #004400; border-radius: 4px; padding: 10px;"></div>
                                <div style="margin-top: 10px; display: flex; gap: 10px;">
                                    <button type="button" id="overwriteSelectedToYx" style="flex: 1; background: rgba(0, 220, 130, 0.3); border: 1px solid #00f0ff; padding: 10px 20px; color: #00f0ff; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; transition: all 0.3s;">${是否值236 ? '覆盖添加' : '覆盖添加'}</button>
                                    <button type="button" id="appendSelectedToYx" style="flex: 1; background: rgba(0, 178, 110, 0.3); border: 1px solid #7aa9c4; padding: 10px 20px; color: #7aa9c4; font-family: 'Courier New', monospace; font-weight: bold; cursor: pointer; transition: all 0.3s;">${是否值236 ? '追加添加' : '追加添加'}</button>
                                </div>
                            </div>
                        </div>

                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.socks5Config}</label>
                                <input type="text" id="socksConfig" placeholder="${是否值236 ? 解码64('2YXYq9in2YQ6IHVzZXI6cGFzc0Bob3N0OnBvcnQg24zYpyBodHRwOi8vdXNlcjpwYXNzQGhvc3Q6cG9ydA==') : 解码64('5L6L5aaCOiB1c2VyOnBhc3NAaG9zdDpwb3J0IOaIliBodHRwOi8vdXNlcjpwYXNzQGhvc3Q6cG9ydA==')}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${是否值236 ? 解码64('2KLYr9ix2LMg2b7YsdmI2qnYs9uMINiu2LHZiNis24wg2KjYsdin24wg2KfZhtiq2YLYp9mEINiq2YXYp9mFINiq2LHYp9mB24zaqSDYrtix2YjYrNuMLiDYqNiv2YjZhiDZvtuM2LTZiNmG2K8g2KjZhyDYtdmI2LHYqiBzNSDYr9ixINmG2LjYsSDar9ix2YHYqtmHINmF24zigIzYtNmI2K8=') : 解码64('5Ye656uZ5Luj55CG5Zyw5Z2A77yM55So5LqO6L2s5Y+R5omA5pyJ5Ye656uZ5rWB6YeP44CC5LiN5YaZ5YmN57yA6buY6K6k5oyJIHM1IOWkhOeQhg==')}</small>
                        </div>
                    </form>

                    <h3 style="color: #00f0ff; margin: 20px 0 15px 0; font-size: 1.2rem;">${翻译值.advancedControl}</h3>
                    <form id="advancedConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.subscriptionConverter}</label>
                                <input type="text" id="scu" placeholder="${翻译值.subscriptionConverterPlaceholder}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.subscriptionConverterHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.builtinPreferred}</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ena" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enableNativeAddress}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="epd" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enablePreferredDomain}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="epi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enablePreferredIP}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="egi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${翻译值.enableGitHubPreferred}</span>
                                    </label>
                                </div>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${翻译值.builtinPreferredHint}</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.jkSection}</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                    <input type="checkbox" id="jk" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                        <span style="font-size: 1.1rem;">${翻译值.jkEnable}</span>
                                </label>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${翻译值.jkHint}</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">优选IP筛选设置</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">IP版本选择</label>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ipv4Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">IPv4</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ipv6Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">IPv6</span>
                                        </label>
                                    </div>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">运营商选择</label>
                                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ispMobile" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">移动</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ispUnicom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">联通</span>
                                        </label>
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ispTelecom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1rem;">电信</span>
                                        </label>
                                    </div>
                                </div>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">选择要使用的IP版本和运营商，未选中的将被过滤</small>
                            </div>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.allowAPIManagement}</label>
                            <select id="apiEnabled" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.apiEnabledDefault}</option>
                                    <option value="yes">${翻译值.apiEnabledYes}</option>
                            </select>
                                <small style="color: #ffb400; font-size: 0.85rem;">${翻译值.apiEnabledHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.regionMatching}</label>
                            <select id="regionMatching" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.regionMatchingDefault}</option>
                                    <option value="no">${翻译值.regionMatchingNo}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.regionMatchingHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.downgradeControl}</label>
                            <select id="downgradeControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.downgradeControlDefault}</option>
                                    <option value="no">${翻译值.downgradeControlNo}</option>
                                    <option value="only">${翻译值.downgradeControlOnly}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.downgradeControlHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.tlsControl}</label>
                            <select id="portControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.tlsControlDefault}</option>
                                    <option value="yes">${翻译值.tlsControlYes}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.tlsControlHint}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${翻译值.preferredControl}</label>
                            <select id="preferredControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${翻译值.preferredControlDefault}</option>
                                    <option value="yes">${翻译值.preferredControlYes}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${翻译值.preferredControlHint}</small>
                        </div>
                    </form>
                    <div id="currentConfig" style="background: rgba(0, 0, 0, 0.9); border: 1px solid #00f0ff; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00f0ff;">
                            ${翻译值.loading}
                    </div>
                    <div id="pathTypeInfo" style="background: rgba(15, 3, 40, 0.7); border: 1px solid #00f0ff; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00f0ff;">
                            <div style="font-weight: bold; margin-bottom: 8px; color: #00ff9d; text-shadow: 0 0 5px #00ff9d;">${翻译值.currentConfig}</div>
                            <div id="pathTypeStatus">${翻译值.checking}</div>
                    </div>
                </div>
                <div id="statusMessage" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #00f0ff; background: rgba(8, 4, 28, 0.8); color: #00f0ff; text-shadow: 0 0 5px #00f0ff;"></div>
            </div>
            
            <div class="card">
                    <h2 class="card-title">${翻译值.relatedLinks}</h2>
                <div style="text-align: center; margin: 20px 0;">
                        <a href="https://github.com/byJoey/cfnew" target="_blank" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">${翻译值.githubProject}</a>
                        <a href="https://github.com/byJoey/yx-tools/releases/" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">${翻译值.优选工具}</a>
                    <a href="https://www.youtube.com/@joeyblog" target="_blank" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">YouTube @joeyblog</a>
                </div>
            </div>
        </div>
        <div id="cpToastStack" class="cp-toast-stack" aria-live="polite" aria-atomic="false"></div>
        <div id="cpActionStatus" class="cp-action-status" role="status" aria-live="polite"></div>
        <div id="cpActionBar" class="cp-action-bar" role="toolbar" aria-label="${翻译值.configManagement}">
            <button type="button" id="cpBtnSaveAll" class="cp-fab-save" title="${是否值236 ? 'ذخیره همه تنظیمات' : '保存所有配置 (Ctrl+S)'}">
                <span class="cp-fab-icon">▣</span>
                <span>${是否值236 ? 'ذخیره همه' : '保 存 全 部'}</span>
                <span class="cp-fab-dot" aria-hidden="true"></span>
            </button>
            <button type="button" id="cpBtnRefresh" class="cp-action-btn" data-tip="${翻译值.refreshConfig}" aria-label="${翻译值.refreshConfig}">
                <span aria-hidden="true">↻</span>
                <span class="cp-btn-label">${翻译值.refreshConfig}</span>
            </button>
            <button type="button" id="cpBtnReset" class="cp-action-btn cp-action-btn-danger" data-tip="${翻译值.resetConfig}" aria-label="${翻译值.resetConfig}">
                <span aria-hidden="true">⌫</span>
                <span class="cp-btn-label">${翻译值.resetConfig}</span>
            </button>
        </div>
        <script>
// 地址从服务器配置注入
var 订阅转换网址 = ${JSON.stringify(订阅转换接口).replaceAll("<", "\\u003c")};
// 远程配置URL（硬编码）
var 远程配置网址 = "${远程配置网址}";

// 翻译对象
const 本地值20215 = {
  zh: {
    subscriptionCopied: '${解码64('6K6i6ZiF6ZO+5o6l5bey5aSN5Yi2')}',
    autoSubscriptionCopied: '${解码64('6Ieq5Yqo6K+G5Yir6K6i6ZiF6ZO+5o6l5bey5aSN5Yi277yM5a6i5oi356uv6K6/6Zeu5pe25Lya5qC55o2uVXNlci1BZ2VudOiHquWKqOivhuWIq+W5tui/lOWbnuWvueW6lOagvOW8jw==')}'
  },
  fa: {
    subscriptionCopied: 'لینک اشتراک کپی شد',
    autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند'
  }
};
async function 请求优选操作(动作, 数据, 信号) {
  return fetch(location.origin + '/api/preferred/' + 动作, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: window.CFNEW.host, uuid: window.CFNEW.uuid, ...数据 }), signal: 信号
  });
}
function 获取凭据20214(名称20213) {
  const 值20212 = '; ' + document.cookie;
  const 部分列表20211 = 值20212.split('; ' + 名称20213 + '=');
  if (部分列表20211.length === 2) return 部分列表20211.pop().split(';').shift();
  return null;
}
const 浏览器语言20210 = navigator.language || navigator.userLanguage || '';
const 已保存语言20209 = localStorage.getItem('preferredLanguage') || 获取凭据20214('preferredLanguage');
let 是否值20208 = false;
if (已保存语言20209 === 'fa' || 已保存语言20209 === 'fa-IR') {
  是否值20208 = true;
} else if (已保存语言20209 === 'zh' || 已保存语言20209 === 'zh-CN') {
  是否值20208 = false;
} else {
  是否值20208 = 浏览器语言20210.includes('fa') || 浏览器语言20210.includes('fa-IR');
}
const 翻译值20207 = 本地值20215[是否值20208 ? 'fa' : 'zh'];
function 切换语言(语言) {
  localStorage.setItem('preferredLanguage', 语言);
  // 设置Cookie（有效期1年）
  const 过期日期20206 = new Date();
  过期日期20206.setFullYear(过期日期20206.getFullYear() + 1);
  document.cookie = 'preferredLanguage=' + 语言 + '; path=/; expires=' + 过期日期20206.toUTCString() + '; SameSite=Lax';
  // 刷新页面，不使用URL参数
  window.location.reload();
}

// 页面加载时检查 localStorage 和 Cookie，并清理URL参数
window.addEventListener('DOMContentLoaded', function () {
  const 已保存语言20205 = localStorage.getItem('preferredLanguage') || 获取凭据20214('preferredLanguage');
  const 网址参数 = new URLSearchParams(window.location.search);
  const 网址语言 = 网址参数.get('lang');

  // 如果URL中有语言参数，移除它并设置Cookie
  if (网址语言) {
    const 当前网址20204 = new URL(window.location.href);
    当前网址20204.searchParams.delete('lang');
    const 新网址 = 当前网址20204.toString();

    // 设置Cookie
    const 过期日期20203 = new Date();
    过期日期20203.setFullYear(过期日期20203.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + 网址语言 + '; path=/; expires=' + 过期日期20203.toUTCString() + '; SameSite=Lax';
    localStorage.setItem('preferredLanguage', 网址语言);

    // 使用history API移除URL参数，不刷新页面
    window.history.replaceState({}, '', 新网址);
  } else if (已保存语言20205) {
    // 如果localStorage中有但Cookie中没有，同步到Cookie
    const 过期日期 = new Date();
    过期日期.setFullYear(过期日期.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + 已保存语言20205 + '; path=/; expires=' + 过期日期.toUTCString() + '; SameSite=Lax';
  }
});

// 赛博朋克风 toast 通知 (替代 alert)
window.显示提示 = function (消息20202, 类型20201, 本地值20200) {
  本地值20200 = 本地值20200 || {};
  var 堆栈 = document.getElementById('cpToastStack');
  if (!堆栈) return;
  var 类型映射 = {
    success: '✓',
    info: '⌬',
    warn: '⚠',
    error: '✕'
  };
  var 标题映射 = {
    success: 'SUCCESS',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR'
  };
  类型20201 = 类型映射[类型20201] ? 类型20201 : 'success';
  var 持续时间 = 本地值20200.duration || 3200;
  var 提示 = document.createElement('div');
  提示.className = 'cp-toast cp-toast-' + 类型20201;
  提示.style.setProperty('--cp-toast-dur', 持续时间 + 'ms');
  var 图标 = document.createElement('span');
  图标.className = 'cp-toast-icon';
  图标.textContent = 类型映射[类型20201];
  var 主体 = document.createElement('div');
  主体.className = 'cp-toast-body';
  var 标题 = document.createElement('div');
  标题.className = 'cp-toast-title';
  标题.textContent = 本地值20200.title || 标题映射[类型20201];
  var 消息20199 = document.createElement('div');
  消息20199.className = 'cp-toast-msg';
  消息20199.textContent = String(消息20202 == null ? '' : 消息20202);
  主体.appendChild(标题);
  主体.appendChild(消息20199);
  var 关闭 = document.createElement('button');
  关闭.type = 'button';
  关闭.className = 'cp-toast-close';
  关闭.setAttribute('aria-label', 'close');
  关闭.textContent = '✕';
  提示.appendChild(图标);
  提示.appendChild(主体);
  提示.appendChild(关闭);
  堆栈.appendChild(提示);
  requestAnimationFrame(function () {
    提示.classList.add('cp-show');
  });
  var 本地值20198 = false;
  function 关闭提示() {
    if (本地值20198) return;
    本地值20198 = true;
    提示.classList.remove('cp-show');
    提示.classList.add('cp-hide');
    setTimeout(function () {
      if (提示.parentNode) 提示.parentNode.removeChild(提示);
    }, 400);
  }
  关闭.addEventListener('click', 关闭提示);
  var 计时器 = setTimeout(关闭提示, 持续时间);
  提示.addEventListener('mouseenter', function () {
    clearTimeout(计时器);
  });
  提示.addEventListener('mouseleave', function () {
    计时器 = setTimeout(关闭提示, 1200);
  });
  return {
    dismiss: 关闭提示,
    element: 提示
  };
};
function 尝试打开应用(方案网址20197, 回退回调, 超时20196) {
  超时20196 = 超时20196 || 2500;
  var 应用已打开 = false;
  var 回调已执行 = false;
  var 开始值 = Date.now();
  var 值值20195 = function () {
    var 耗时20194 = Date.now() - 开始值;
    if (耗时20194 < 3000 && !回调已执行) {
      应用已打开 = true;
    }
  };
  window.addEventListener('blur', 值值20195);
  var 值值20193 = function () {
    var 耗时 = Date.now() - 开始值;
    if (耗时 < 3000 && !回调已执行) {
      应用已打开 = true;
    }
  };
  document.addEventListener('visibilitychange', 值值20193);
  var 内嵌框架 = document.createElement('iframe');
  内嵌框架.style.display = 'none';
  内嵌框架.style.width = '1px';
  内嵌框架.style.height = '1px';
  内嵌框架.src = 方案网址20197;
  document.body.appendChild(内嵌框架);
  setTimeout(function () {
    内嵌框架.parentNode && 内嵌框架.parentNode.removeChild(内嵌框架);
    window.removeEventListener('blur', 值值20195);
    document.removeEventListener('visibilitychange', 值值20193);
    if (!回调已执行) {
      回调已执行 = true;
      if (!应用已打开 && 回退回调) {
        回退回调();
      }
    }
  }, 超时20196);
}
function 生成客户端链接(客户端类型, 客户端名称) {
  var 当前网址20192 = window.location.href;
  var 订阅网址20191 = window.CFNEW.subUrl;
  var 方案网址 = '';
  var 显示名称 = 客户端名称 || '';
  var 最终网址 = 订阅网址20191;
  if (客户端类型 === atob('djJyYXk=')) {
    最终网址 = 订阅网址20191;
    var 网址值20190 = document.getElementById("clientSubscriptionUrl");
    网址值20190.textContent = 最终网址;
    网址值20190.style.display = "block";
    网址值20190.style.overflowWrap = "break-word";
    网址值20190.style.wordBreak = "break-all";
    网址值20190.style.overflowX = "auto";
    网址值20190.style.maxWidth = "100%";
    网址值20190.style.boxSizing = "border-box";
    if (客户端名称 === 'V2RAY') {
      navigator.clipboard.writeText(最终网址).then(function () {
        显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
      });
    } else if (客户端名称 === 'Shadowrocket') {
      方案网址 = '${解码64('c2hhZG93cm9ja2V0Oi8vYWRkLw==')}' + encodeURIComponent(最终网址);
      尝试打开应用(方案网址, function () {
        navigator.clipboard.writeText(最终网址).then(function () {
          显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
        });
      });
    } else if (客户端名称 === 'V2RAYNG') {
      方案网址 = '${解码64('djJyYXluZzovL2luc3RhbGw/dXJsPQ==')}' + encodeURIComponent(最终网址);
      尝试打开应用(方案网址, function () {
        navigator.clipboard.writeText(最终网址).then(function () {
          显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
        });
      });
    } else if (客户端名称 === 'NEKORAY') {
      方案网址 = '${解码64('bmVrb3JheTovL2luc3RhbGwtY29uZmlnP3VybD0=')}' + encodeURIComponent(最终网址);
      尝试打开应用(方案网址, function () {
        navigator.clipboard.writeText(最终网址).then(function () {
          显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
        });
      });
    }
  } else {
    // 统一走内部格式转换
    最终网址 = 订阅网址20191 + (订阅网址20191.includes('?') ? '&' : '?') + "target=" + 客户端类型;
    var 网址值20190 = document.getElementById("clientSubscriptionUrl");
    网址值20190.textContent = 最终网址;
    网址值20190.style.display = "block";
    网址值20190.style.overflowWrap = "break-word";
    网址值20190.style.wordBreak = "break-all";
    网址值20190.style.overflowX = "auto";
    网址值20190.style.maxWidth = "100%";
    网址值20190.style.boxSizing = "border-box";
    if (客户端类型 === 'vg') {
      方案网址 = '${解码64('Y2xhc2g6Ly9pbnN0YWxsLWNvbmZpZz91cmw9')}' + encodeURIComponent(最终网址);
    } else if (客户端类型 === atob('Y2xhc2g=')) {
      if (客户端名称 === 'STASH') {
        方案网址 = '${解码64('c3Rhc2g6Ly9pbnN0YWxsP3VybD0=')}' + encodeURIComponent(最终网址);
        显示名称 = 'STASH';
      } else {
        方案网址 = '${解码64('Y2xhc2g6Ly9pbnN0YWxsLWNvbmZpZz91cmw9')}' + encodeURIComponent(最终网址);
        显示名称 = 'CLASH';
      }
    } else if (客户端类型 === atob('c3VyZ2U=')) {
      方案网址 = '${解码64('c3VyZ2U6Ly8vaW5zdGFsbC1jb25maWc/dXJsPQ==')}' + encodeURIComponent(最终网址);
      显示名称 = 'SURGE';
    } else if (客户端类型 === atob('c2luZ2JveA==')) {
      方案网址 = '${解码64('c2luZy1ib3g6Ly9pbnN0YWxsLWNvbmZpZz91cmw9')}' + encodeURIComponent(最终网址);
      显示名称 = 'SING-BOX';
    } else if (客户端类型 === atob('bG9vbg==')) {
      方案网址 = '${解码64('bG9vbjovL2luc3RhbGw/dXJsPQ==')}' + encodeURIComponent(最终网址);
      显示名称 = 'LOON';
    } else if (客户端类型 === atob('cXVhbng=')) {
      方案网址 = '${解码64('cXVhbnR1bXVsdC14Oi8vaW5zdGFsbC1jb25maWc/dXJsPQ==')}' + encodeURIComponent(最终网址);
      显示名称 = 'QUANTUMULT X';
    }
    if (方案网址) {
      尝试打开应用(方案网址, function () {
        navigator.clipboard.writeText(最终网址).then(function () {
          显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
        });
      });
    } else {
      navigator.clipboard.writeText(最终网址).then(function () {
        显示提示(显示名称 + " " + 翻译值20207.subscriptionCopied, 'success');
      });
    }
  }
}

// 页面特效图形化开关 (localStorage 持久化)
window.应用页面特效 = function () {
  var 本地值20189 = localStorage.getItem('cp-fx-off') === '1';
  document.body.classList.toggle('fx-off', 本地值20189);
  var 本地值20188 = document.getElementById('cpFxLabel');
  if (本地值20188) 本地值20188.textContent = 本地值20189 ? 'FX: OFF' : 'FX: ON';
  if (本地值20189) {
    var 本地值20187 = document.getElementById('matrixCodeRain');
    if (本地值20187) 本地值20187.innerHTML = '';
  } else if (typeof 创建矩阵雨 === 'function') {
    var 结果值 = document.getElementById('matrixCodeRain');
    if (结果值 && !结果值.firstChild) 创建矩阵雨();
  }
};
window.切换页面特效 = function () {
  var 本地值20186 = localStorage.getItem('cp-fx-off') === '1';
  localStorage.setItem('cp-fx-off', 本地值20186 ? '0' : '1');
  window.应用页面特效();
};
(function () {
  if (localStorage.getItem('cp-fx-off') === '1') {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('fx-off');
      var 本地值20185 = document.getElementById('cpFxLabel');
      if (本地值20185) 本地值20185.textContent = 'FX: OFF';
    });
  }
})();
function 创建矩阵雨() {
  if (document.body && document.body.classList.contains('fx-off')) return;
  const 矩阵值 = document.getElementById('matrixCodeRain');
  if (!矩阵值) return;
  const 赛博字符列表 = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ$%#@!?<>+=ABCDEF';
  const 调色板 = ['#00f0ff', '#ff2bd6', '#a347ff', '#00ff9d'];
  const 列数 = Math.floor(window.innerWidth / 20);
  for (let 索引值20184 = 0; 索引值20184 < 列数; 索引值20184++) {
    const 列20183 = document.createElement('div');
    列20183.className = 'matrix-column';
    列20183.style.left = 索引值20184 * 20 + 'px';
    列20183.style.animationDelay = -Math.random() * 15 + 's';
    列20183.style.animationDuration = Math.random() * 14 + 8 + 's';
    列20183.style.fontSize = Math.random() * 4 + 12 + 'px';
    列20183.style.opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
    let 文本20182 = '';
    const 字符数量 = Math.floor(Math.random() * 30 + 18);
    for (let 次索引值 = 0; 次索引值 < 字符数量; 次索引值++) {
      const 字符 = 赛博字符列表[Math.floor(Math.random() * 赛博字符列表.length)];
      const 值强调 = Math.random() > 0.85;
      const 颜色 = 值强调 ? 调色板[Math.floor(Math.random() * 调色板.length)] : '';
      文本20182 += 颜色 ? '<span style="color:' + 颜色 + ';text-shadow:0 0 8px ' + 颜色 + ';">' + 字符 + '</span><br>' : '<span>' + 字符 + '</span><br>';
    }
    列20183.innerHTML = 文本20182;
    矩阵值.appendChild(列20183);
  }
  setInterval(function () {
    const 列列表 = 矩阵值.querySelectorAll('.matrix-column');
    列列表.forEach(function (列) {
      if (Math.random() > 0.94) {
        const 字符列表 = 列.querySelectorAll('span');
        if (字符列表.length > 0) {
          const 目标20181 = 字符列表[Math.floor(Math.random() * 字符列表.length)];
          const 本地值20180 = 目标20181.style.color;
          目标20181.style.color = '#ffffff';
          目标20181.style.textShadow = '0 0 10px #ffffff, 0 0 18px #00f0ff';
          setTimeout(function () {
            目标20181.style.color = 本地值20180;
            目标20181.style.textShadow = '';
          }, 200);
        }
      }
    });
  }, 110);
}
async function 检查系统状态() {
  try {
    const 云墙状态 = document.getElementById('cfStatus');
    const 地区状态 = document.getElementById('regionStatus');
    const 值值20179 = document.getElementById('geoInfo');
    const 备用状态 = document.getElementById('backupStatus');
    const 当前地址 = document.getElementById('currentIP');
    const 地区值 = document.getElementById('regionMatch');

    // 获取当前语言设置（优先从Cookie/localStorage读取）
    function 获取凭据20178(名称20177) {
      const 值20176 = '; ' + document.cookie;
      const 部分列表20175 = 值20176.split('; ' + 名称20177 + '=');
      if (部分列表20175.length === 2) return 部分列表20175.pop().split(';').shift();
      return null;
    }
    const 浏览器语言20174 = navigator.language || navigator.userLanguage || '';
    const 已保存语言20173 = localStorage.getItem('preferredLanguage') || 获取凭据20178('preferredLanguage');
    let 是否值20172 = false;
    if (已保存语言20173 === 'fa' || 已保存语言20173 === 'fa-IR') {
      是否值20172 = true;
    } else if (已保存语言20173 === 'zh' || 已保存语言20173 === 'zh-CN') {
      是否值20172 = false;
    } else {
      是否值20172 = 浏览器语言20174.includes('fa') || 浏览器语言20174.includes('fa-IR');
    }
    const 本地值20171 = {
      zh: {
        workerRegion: 'Worker地区: ',
        detectionMethod: '检测方式: ',
        proxyIPStatus: '${解码64('UHJveHlJUOeKtuaAgTog')}',
        currentIP: '当前使用IP: ',
        regionMatch: '地区匹配: ',
        regionNames: {
          'CF': '${解码64('8J+MkCDlrpjmlrnnm7Tov54=')}',
          'HK': '🇭🇰 香港',
          'US': '🇺🇸 美国',
          'SG': '🇸🇬 新加坡',
          'JP': '🇯🇵 日本',
          'KR': '🇰🇷 韩国',
          'DE': '🇩🇪 德国',
          'SE': '🇸🇪 瑞典',
          'NL': '🇳🇱 荷兰',
          'FI': '🇫🇮 芬兰',
          'GB': '🇬🇧 英国'
        },
        customIPMode: '${解码64('6Ieq5a6a5LmJUHJveHlJUOaooeW8jyAocOWPmOmHj+WQr+eUqCk=')}',
        customIPModeDesc: '自定义IP模式 (已禁用地区匹配)',
        usingCustomProxyIP: '${解码64('5L2/55So6Ieq5a6a5LmJUHJveHlJUDog')}',
        customIPConfig: ' (p变量配置)',
        customIPModeDisabled: '自定义IP模式，地区选择已禁用',
        manualRegion: '手动指定地区',
        manualRegionDesc: ' (手动指定)',
        proxyIPAvailable: '${解码64('MTAvMTAg5Y+v55SoIChQcm94eUlQ5Z+f5ZCN6aKE6K6+5Y+v55SoKQ==')}',
        smartSelection: '智能就近选择中',
        sameRegionIP: '同地区IP可用 (1个)',
        cloudflareDetection: '${解码64('5a6Y5pa555u06L+e')}',
        detectionFailed: '检测失败',
        unknown: '未知'
      },
      fa: {
        workerRegion: 'منطقه Worker: ',
        detectionMethod: 'روش تشخیص: ',
        proxyIPStatus: '${解码64('2YjYtti524zYqiBQcm94eUlQOiA=')}',
        currentIP: 'IP فعلی: ',
        regionMatch: 'تطبیق منطقه: ',
        regionNames: {
          'CF': '🌐 مستقیم رسمی',
          'HK': '🇭🇰 هنگ کنگ',
          'US': '🇺🇸 آمریکا',
          'SG': '🇸🇬 سنگاپور',
          'JP': '🇯🇵 ژاپن',
          'KR': '🇰🇷 کره جنوبی',
          'DE': '🇩🇪 آلمان',
          'SE': '🇸🇪 سوئد',
          'NL': '🇳🇱 هلند',
          'FI': '🇫🇮 فنلاند',
          'GB': '🇬🇧 بریتانیا'
        },
        customIPMode: '${解码64('2K3Yp9mE2KogUHJveHlJUCDYs9mB2KfYsdi024wgKNmF2KrYutuM2LEgcCDZgdi52KfZhCDYp9iz2Kop')}',
        customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
        usingCustomProxyIP: '${解码64('2KfYs9iq2YHYp9iv2Ycg2KfYsiBQcm94eUlQINiz2YHYp9ix2LTbjDog')}',
        customIPConfig: ' (پیکربندی متغیر p)',
        customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
        manualRegion: 'تعیین منطقه دستی',
        manualRegionDesc: ' (تعیین دستی)',
        proxyIPAvailable: '${解码64('MTAvMTAg2K/YsSDYr9iz2KrYsdizICjYr9in2YXZhtmHINm+24zYtOKAjNmB2LHYtiBQcm94eUlQINiv2LEg2K/Ys9iq2LHYsyDYp9iz2Kop')}',
        smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
        sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
        cloudflareDetection: 'اتصال مستقیم رسمی',
        detectionFailed: 'تشخیص ناموفق',
        unknown: 'ناشناخته'
      }
    };
    const 翻译值20170 = 本地值20171[是否值20172 ? 'fa' : 'zh'];
    let 值地区20169 = 'US'; // 默认值
    let 是否自定义地址值 = false;
    let 是否手动地区值 = false;
    try {
      const 响应20168 = await fetch(window.CFNEW.apiBase + '/region');
      const 数据20167 = await 响应20168.json();
      if (数据20167.region === 'CUSTOM') {
        是否自定义地址值 = true;
        值地区20169 = 'CUSTOM';

        // 获取自定义IP的详细信息
        const 自定义地址值 = 数据20167.ci || 翻译值20170.unknown;
        值值20179.innerHTML = 翻译值20170.detectionMethod + '<span style="color: #ffb400;">⚙️ ' + 翻译值20170.customIPMode + '</span>';
        地区状态.innerHTML = 翻译值20170.workerRegion + '<span style="color: #ffb400;">🔧 ' + 翻译值20170.customIPModeDesc + '</span>';

        // 显示自定义IP配置状态，包含具体IP
        if (备用状态) 备用状态.innerHTML = 翻译值20170.proxyIPStatus + '<span style="color: #ffb400;">🔧 ' + 翻译值20170.usingCustomProxyIP + 自定义地址值 + '</span>';
        if (当前地址) 当前地址.innerHTML = 翻译值20170.currentIP + '<span style="color: #ffb400;">✅ ' + 自定义地址值 + 翻译值20170.customIPConfig + '</span>';
        if (地区值) 地区值.innerHTML = 翻译值20170.regionMatch + '<span style="color: #ffb400;">⚠️ ' + 翻译值20170.customIPModeDisabled + '</span>';
        return; // 提前返回，不执行后续的地区匹配逻辑
      } else if (数据20167.detectionMethod === '手动指定地区' || 数据20167.detectionMethod === 'تعیین منطقه دستی') {
        是否手动地区值 = true;
        值地区20169 = 数据20167.region;
        值值20179.innerHTML = 翻译值20170.detectionMethod + '<span style="color: #00b380;">' + 翻译值20170.manualRegion + '</span>';
        地区状态.innerHTML = 翻译值20170.workerRegion + '<span style="color: #00ff9d;">🎯 ' + 翻译值20170.regionNames[值地区20169] + 翻译值20170.manualRegionDesc + '</span>';

        // 显示配置状态而不是检测状态
        if (备用状态) 备用状态.innerHTML = 翻译值20170.proxyIPStatus + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.proxyIPAvailable + '</span>';
        if (当前地址) 当前地址.innerHTML = 翻译值20170.currentIP + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.smartSelection + '</span>';
        if (地区值) 地区值.innerHTML = 翻译值20170.regionMatch + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.sameRegionIP + '</span>';
        return; // 提前返回，不执行后续的地区匹配逻辑
      } else if (数据20167.region && 翻译值20170.regionNames[数据20167.region]) {
        值地区20169 = 数据20167.region;
      }
      值值20179.innerHTML = 翻译值20170.detectionMethod + '<span style="color: #00ff9d;">' + 翻译值20170.cloudflareDetection + '</span>';
    } catch (事件值20166) {
      值值20179.innerHTML = 翻译值20170.detectionMethod + '<span style="color: #ff3860;">' + 翻译值20170.detectionFailed + '</span>';
    }
    地区状态.innerHTML = 翻译值20170.workerRegion + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.regionNames[值地区20169] + '</span>';

    // 直接显示配置状态，不再进行检测
    if (备用状态) {
      备用状态.innerHTML = 翻译值20170.proxyIPStatus + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.proxyIPAvailable + '</span>';
    }
    if (当前地址) {
      当前地址.innerHTML = 翻译值20170.currentIP + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.smartSelection + '</span>';
    }
    if (地区值) {
      地区值.innerHTML = 翻译值20170.regionMatch + '<span style="color: #00ff9d;">✅ ' + 翻译值20170.sameRegionIP + '</span>';
    }
  } catch (错误20165) {
    function 获取凭据20164(名称20163) {
      const 值20162 = '; ' + document.cookie;
      const 部分列表20161 = 值20162.split('; ' + 名称20163 + '=');
      if (部分列表20161.length === 2) return 部分列表20161.pop().split(';').shift();
      return null;
    }
    const 浏览器语言20160 = navigator.language || navigator.userLanguage || '';
    const 已保存语言20159 = localStorage.getItem('preferredLanguage') || 获取凭据20164('preferredLanguage');
    let 是否值20158 = false;
    if (已保存语言20159 === 'fa' || 已保存语言20159 === 'fa-IR') {
      是否值20158 = true;
    } else {
      是否值20158 = 浏览器语言20160.includes('fa') || 浏览器语言20160.includes('fa-IR');
    }
    const 本地值20157 = {
      zh: {
        workerRegion: 'Worker地区: ',
        detectionMethod: '检测方式: ',
        proxyIPStatus: '${解码64('UHJveHlJUOeKtuaAgTog')}',
        currentIP: '当前使用IP: ',
        regionMatch: '地区匹配: ',
        detectionFailed: '检测失败'
      },
      fa: {
        workerRegion: 'منطقه Worker: ',
        detectionMethod: 'روش تشخیص: ',
        proxyIPStatus: '${解码64('2YjYtti524zYqiBQcm94eUlQOiA=')}',
        currentIP: 'IP فعلی: ',
        regionMatch: 'تطبیق منطقه: ',
        detectionFailed: 'تشخیص ناموفق'
      }
    };
    const 翻译值20156 = 本地值20157[是否值20158 ? 'fa' : 'zh'];
    document.getElementById('regionStatus').innerHTML = 翻译值20156.workerRegion + '<span style="color: #ff3860;">❌ ' + 翻译值20156.detectionFailed + '</span>';
    document.getElementById('geoInfo').innerHTML = 翻译值20156.detectionMethod + '<span style="color: #ff3860;">❌ ' + 翻译值20156.detectionFailed + '</span>';
    document.getElementById('backupStatus').innerHTML = 翻译值20156.proxyIPStatus + '<span style="color: #ff3860;">❌ ' + 翻译值20156.detectionFailed + '</span>';
    document.getElementById('currentIP').innerHTML = 翻译值20156.currentIP + '<span style="color: #ff3860;">❌ ' + 翻译值20156.detectionFailed + '</span>';
    document.getElementById('regionMatch').innerHTML = 翻译值20156.regionMatch + '<span style="color: #ff3860;">❌ ' + 翻译值20156.detectionFailed + '</span>';
  }
}
async function 测试接口() {
  try {
    function 获取凭据20155(名称20154) {
      const 值20153 = '; ' + document.cookie;
      const 部分列表20152 = 值20153.split('; ' + 名称20154 + '=');
      if (部分列表20152.length === 2) return 部分列表20152.pop().split(';').shift();
      return null;
    }
    const 浏览器语言20151 = navigator.language || navigator.userLanguage || '';
    const 已保存语言20150 = localStorage.getItem('preferredLanguage') || 获取凭据20155('preferredLanguage');
    let 是否值20149 = false;
    if (已保存语言20150 === 'fa' || 已保存语言20150 === 'fa-IR') {
      是否值20149 = true;
    } else {
      是否值20149 = 浏览器语言20151.includes('fa') || 浏览器语言20151.includes('fa-IR');
    }
    const 本地值20148 = {
      zh: {
        apiTestResult: 'API检测结果: ',
        apiTestTime: '检测时间: ',
        apiTestFailed: 'API检测失败: ',
        unknownError: '未知错误',
        apiTestError: 'API测试失败: '
      },
      fa: {
        apiTestResult: 'نتیجه تشخیص API: ',
        apiTestTime: 'زمان تشخیص: ',
        apiTestFailed: 'تشخیص API ناموفق: ',
        unknownError: 'خطای ناشناخته',
        apiTestError: 'تست API ناموفق: '
      }
    };
    const 翻译值20147 = 本地值20148[是否值20149 ? 'fa' : 'zh'];
    const 响应20146 = await fetch(window.CFNEW.apiBase + '/test-api');
    const 数据20145 = await 响应20146.json();
    if (数据20145.detectedRegion) {
      显示提示(翻译值20147.apiTestResult + 数据20145.detectedRegion + '\\n' + 翻译值20147.apiTestTime + 数据20145.timestamp, 'info', {
        duration: 5000
      });
    } else {
      显示提示(翻译值20147.apiTestFailed + (数据20145.error || 翻译值20147.unknownError), 'error', {
        duration: 4500
      });
    }
  } catch (错误20144) {
    function 获取凭据20143(名称20142) {
      const 值20141 = '; ' + document.cookie;
      const 部分列表20140 = 值20141.split('; ' + 名称20142 + '=');
      if (部分列表20140.length === 2) return 部分列表20140.pop().split(';').shift();
      return null;
    }
    const 浏览器语言20139 = navigator.language || navigator.userLanguage || '';
    const 已保存语言20138 = localStorage.getItem('preferredLanguage') || 获取凭据20143('preferredLanguage');
    let 是否值20137 = false;
    if (已保存语言20138 === 'fa' || 已保存语言20138 === 'fa-IR') {
      是否值20137 = true;
    } else {
      是否值20137 = 浏览器语言20139.includes('fa') || 浏览器语言20139.includes('fa-IR');
    }
    const 本地值20136 = {
      zh: {
        apiTestError: 'API测试失败: '
      },
      fa: {
        apiTestError: 'تست API ناموفق: '
      }
    };
    const 翻译值20135 = 本地值20136[是否值20137 ? 'fa' : 'zh'];
    显示提示(翻译值20135.apiTestError + 错误20144.message, 'error', {
      duration: 4500
    });
  }
}

// 配置管理相关函数
async function 检查键值状态() {
  const 接口网址20134 = window.CFNEW.apiBase + '/api/config';
  try {
    const 响应20133 = await fetch(接口网址20134);
    function 获取凭据20132(名称20131) {
      const 值20130 = '; ' + document.cookie;
      const 部分列表20129 = 值20130.split('; ' + 名称20131 + '=');
      if (部分列表20129.length === 2) return 部分列表20129.pop().split(';').shift();
      return null;
    }
    const 浏览器语言20128 = navigator.language || navigator.userLanguage || '';
    const 已保存语言20127 = localStorage.getItem('preferredLanguage') || 获取凭据20132('preferredLanguage');
    let 是否值20126 = false;
    if (已保存语言20127 === 'fa' || 已保存语言20127 === 'fa-IR') {
      是否值20126 = true;
    } else {
      是否值20126 = 浏览器语言20128.includes('fa') || 浏览器语言20128.includes('fa-IR');
    }
    const 本地值20125 = {
      zh: {
        kvDisabled: '⚠️ KV存储未启用或未配置',
        kvNotConfigured: 'KV存储未配置，无法使用配置管理功能。\\n\\n请在Cloudflare Workers中:\\n1. 创建KV命名空间\\n2. 绑定环境变量 C\\n3. 重新部署代码',
        kvNotEnabled: 'KV存储未配置',
        kvEnabled: '✅ KV存储已启用，可以使用配置管理功能',
        kvCheckFailed: '⚠️ KV存储检测失败',
        kvCheckFailedFormat: 'KV存储检测失败: 响应格式错误',
        kvCheckFailedStatus: 'KV存储检测失败 - 状态码: ',
        kvCheckFailedError: 'KV存储检测失败 - 错误: '
      },
      fa: {
        kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
        kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است، نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
        kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
        kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
        kvCheckFailed: '⚠️ بررسی ذخیره‌سازی KV ناموفق',
        kvCheckFailedFormat: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
        kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
        kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
      }
    };
    const 翻译值20124 = 本地值20125[是否值20126 ? 'fa' : 'zh'];
    if (响应20133.status === 503) {
      // KV未配置
      document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + 翻译值20124.kvDisabled + '</span>';
      document.getElementById('configCard').style.display = 'block';
      document.getElementById('currentConfig').textContent = 翻译值20124.kvNotConfigured;
    } else if (响应20133.ok) {
      try {
        const 数据20123 = await 响应20133.json();

        // 检查响应是否包含KV配置信息
        if (数据20123 && 数据20123.kvEnabled === true) {
          document.getElementById('kvStatus').innerHTML = '<span style="color: #00ff9d;">' + 翻译值20124.kvEnabled + '</span>';
          document.getElementById('configContent').style.display = 'block';
          document.getElementById('configCard').style.display = 'block';
          await 加载当前配置();
        } else {
          document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + 翻译值20124.kvDisabled + '</span>';
          document.getElementById('configCard').style.display = 'block';
          document.getElementById('currentConfig').textContent = 翻译值20124.kvNotEnabled;
        }
      } catch (数据对象错误) {
        document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + 翻译值20124.kvCheckFailed + '</span>';
        document.getElementById('configCard').style.display = 'block';
        document.getElementById('currentConfig').textContent = 翻译值20124.kvCheckFailedFormat;
      }
    } else {
      document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + 翻译值20124.kvDisabled + '</span>';
      document.getElementById('configCard').style.display = 'block';
      document.getElementById('currentConfig').textContent = 翻译值20124.kvCheckFailedStatus + 响应20133.status;
    }
  } catch (错误20122) {
    function 获取凭据(名称) {
      const 值20121 = '; ' + document.cookie;
      const 部分列表20120 = 值20121.split('; ' + 名称 + '=');
      if (部分列表20120.length === 2) return 部分列表20120.pop().split(';').shift();
      return null;
    }
    const 浏览器语言 = navigator.language || navigator.userLanguage || '';
    const 已保存语言 = localStorage.getItem('preferredLanguage') || 获取凭据('preferredLanguage');
    let 是否值 = false;
    if (已保存语言 === 'fa' || 已保存语言 === 'fa-IR') {
      是否值 = true;
    } else {
      是否值 = 浏览器语言.includes('fa') || 浏览器语言.includes('fa-IR');
    }
    const 本地值20119 = {
      zh: {
        kvDisabled: '⚠️ KV存储未启用或未配置',
        kvCheckFailedError: 'KV存储检测失败 - 错误: '
      },
      fa: {
        kvDisabled: '⚠️ ذخیره‌سازی KV فعال نیست یا پیکربندی نشده است',
        kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
      }
    };
    const 翻译值20118 = 本地值20119[是否值 ? 'fa' : 'zh'];
    document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + 翻译值20118.kvDisabled + '</span>';
    document.getElementById('configCard').style.display = 'block';
    document.getElementById('currentConfig').textContent = 翻译值20118.kvCheckFailedError + 错误20122.message;
  }
}
function 读取字段值(标识) {
  const 元素 = document.getElementById(标识);
  return 元素 ? 元素.value : '';
}

function 写入字段值(标识, 值 = '') {
  const 元素 = document.getElementById(标识);
  if (元素) 元素.value = 值 || '';
}

function 是否开关启用(值, 默认启用 = false) {
  if (值 === undefined || 值 === null || 值 === '') return 默认启用;
  if (值 === true || 值 === false) return 值;
  const 文本 = String(值).trim().toLowerCase();
  if (文本 === 'yes' || 文本 === 'true' || 文本 === '1' || 文本 === 'on') return true;
  if (文本 === 'no' || 文本 === 'false' || 文本 === '0' || 文本 === 'off') return false;
  return 默认启用;
}

function 写入开关值(标识, 值, 默认启用 = false) {
  const 元素 = document.getElementById(标识);
  if (元素) 元素.checked = 是否开关启用(值, 默认启用);
}

function 读取开关值(标识, 默认启用 = false) {
  const 元素 = document.getElementById(标识);
  if (!元素) return 默认启用 ? 'yes' : 'no';
  return 元素.checked ? 'yes' : 'no';
}

function 同步协议界面状态() {
  const 明文开关 = document.getElementById('ev');
  const 木马开关 = document.getElementById('et');
  const 扩展开关 = document.getElementById('ex');
  if (明文开关 && 木马开关 && 扩展开关 && !明文开关.checked && !木马开关.checked && !扩展开关.checked) {
    明文开关.checked = true;
  }
}

function 同步联动界面状态() {
  同步协议界面状态();
  const 加密客户端问候复选框 = document.getElementById('ech');
  const 端口控制 = document.getElementById('portControl');
  if (加密客户端问候复选框 && 端口控制 && 加密客户端问候复选框.checked) {
    端口控制.value = 'yes';
  }
  更新路径类型状态(读取字段值('customPath'));
  更新工作器地区状态();
}

function 应用配置到界面(配置) {
  写入字段值('wkRegion', 配置.wk);
  写入开关值('freeCpu', 配置.freeCpu, false);
  写入开关值('ev', 配置.ev, true);
  写入开关值('et', 配置.et, false);
  写入开关值('ex', 配置.ex, false);
  写入开关值('ech', 配置.ech, false);
  写入字段值('tp', 配置.tp);
  写入字段值('customDNS', 配置.customDNS);
  写入字段值('customECHDomain', 配置.customECHDomain);
  写入字段值('alpn', 配置.alpn);
  写入字段值('scu', 配置.scu);
  写入开关值('ena', 配置.ena, false);
  写入开关值('jk', 配置.jk, false);
  const 家宽按钮 = document.getElementById('jkClientBtn');
  if (家宽按钮) 家宽按钮.style.display = 是否开关启用(配置.jk, false) ? '' : 'none';
  写入开关值('epd', 配置.epd, true);
  写入开关值('epi', 配置.epi, true);
  写入开关值('egi', 配置.egi, true);
  写入开关值('ipv4Enabled', 配置.ipv4, true);
  写入开关值('ipv6Enabled', 配置.ipv6, true);
  写入开关值('ispMobile', 配置.ispMobile, true);
  写入开关值('ispUnicom', 配置.ispUnicom, true);
  写入开关值('ispTelecom', 配置.ispTelecom, true);
  写入字段值('customPath', 配置.d);
  写入字段值('customIP', 配置.p);
  写入字段值('yx', (配置.yx || '').split(/[,\\r\\n]+/).map(值 => 值.trim()).filter(Boolean).join('\\n'));
  写入字段值('yxURL', 配置.yxURL);
  写入字段值('socksConfig', 配置.s);
  写入字段值('customHomepage', 配置.homepage);
  写入字段值('apiEnabled', 配置.ae);
  写入字段值('regionMatching', 配置.rm);
  写入字段值('downgradeControl', 配置.qj);
  写入字段值('portControl', 配置.dkby);
  写入字段值('preferredControl', 配置.yxby);
  同步联动界面状态();
}

function 收集界面配置() {
  const 配置 = {
    wk: 读取字段值('wkRegion'),
    freeCpu: 读取开关值('freeCpu', false),
    ev: 读取开关值('ev', true),
    et: 读取开关值('et', false),
    ex: 读取开关值('ex', false),
    ech: 读取开关值('ech', false),
    tp: 读取字段值('tp'),
    customDNS: 读取字段值('customDNS'),
    customECHDomain: 读取字段值('customECHDomain'),
    alpn: 读取字段值('alpn'),
    d: 读取字段值('customPath'),
    p: 读取字段值('customIP'),
    yx: 读取字段值('yx'),
    yxURL: 读取字段值('yxURL'),
    s: 读取字段值('socksConfig'),
    homepage: 读取字段值('customHomepage'),
    scu: 读取字段值('scu'),
    ena: 读取开关值('ena', false),
    jk: 读取开关值('jk', false),
    epd: 读取开关值('epd', true),
    epi: 读取开关值('epi', true),
    egi: 读取开关值('egi', true),
    ae: 读取字段值('apiEnabled'),
    rm: 读取字段值('regionMatching'),
    qj: 读取字段值('downgradeControl'),
    dkby: 读取字段值('portControl'),
    yxby: 读取字段值('preferredControl'),
    ipv4: 读取开关值('ipv4Enabled', true),
    ipv6: 读取开关值('ipv6Enabled', true),
    ispMobile: 读取开关值('ispMobile', true),
    ispUnicom: 读取开关值('ispUnicom', true),
    ispTelecom: 读取开关值('ispTelecom', true)
  };
  if (document.getElementById('freeCpu')?.disabled) delete 配置.freeCpu;
  if (配置.ev === 'no' && 配置.et === 'no' && 配置.ex === 'no') {
    配置.ev = 'yes';
    写入开关值('ev', 'yes', true);
  }
  if (配置.ech === 'yes') {
    配置.dkby = 'yes';
    写入字段值('portControl', 'yes');
  }
  return 配置;
}

async function 加载当前配置() {
  const 接口网址20117 = window.CFNEW.apiBase + '/api/config';
  try {
    const 响应20116 = await fetch(接口网址20117);
    if (响应20116.status === 503) {
      document.getElementById('currentConfig').textContent = 'KV存储未配置，无法加载配置';
      return;
    }
    if (!响应20116.ok) {
      const 错误文本20115 = await 响应20116.text();
      document.getElementById('currentConfig').textContent = '加载配置失败: ' + 错误文本20115;
      return;
    }
    const 配置 = await 响应20116.json();

    // 过滤掉入口鉴权与 KV 状态字段。
    const 显示配置 = {};
    for (const [键20114, 值20113] of Object.entries(配置)) {
      if (键20114 !== 'kvEnabled' && 键20114 !== 'uuid' && 键20114 !== 'coreVersion') {
        显示配置[键20114] = 值20113;
      }
    }
    let 配置文本 = '当前配置:\\n';
    if (Object.keys(显示配置).length === 0) {
      配置文本 += '(暂无配置)';
    } else {
      for (const [键, 值20112] of Object.entries(显示配置)) {
        配置文本 += 键 + ': ' + (值20112 || '(未设置)') + '\\n';
      }
    }
    document.getElementById('currentConfig').textContent = 配置文本;

    应用配置到界面(配置);
  } catch (错误20111) {
    document.getElementById('currentConfig').textContent = '加载配置失败: ' + 错误20111.message;
  }
}

// 更新路径类型显示
function 更新路径类型状态(customPath) {
  const element = document.getElementById('pathTypeStatus');
  if (!element) return;
  element.replaceChildren();
  const configPath = document.createElement('div');
  configPath.textContent = '配置路径：' + (customPath || '/' + window.CFNEW.uuid);
  const label = document.createElement('div');
  label.textContent = '订阅地址：';
  const link = document.createElement('a');
  link.href = window.CFNEW.subUrl;
  link.textContent = window.CFNEW.subUrl;
  link.style.cssText = 'color:#00f0ff;overflow-wrap:anywhere';
  label.append(link);
  element.append(configPath, label);
}
function 更新工作器地区状态() {
  const 自定义地址输入20108 = document.getElementById('customIP');
  const 值地区 = document.getElementById('wkRegion');
  const 值地区值 = document.getElementById('wkRegionHint');
  if (自定义地址输入20108 && 值地区) {
    const 是否有自定义地址 = 自定义地址输入20108.value.trim() !== '';
    值地区.disabled = 是否有自定义地址;

    // 添加视觉反馈
    if (是否有自定义地址) {
      值地区.style.opacity = '0.5';
      值地区.style.cursor = 'not-allowed';
      值地区.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      // 显示提示信息
      if (值地区值) {
        值地区值.style.display = 'block';
        值地区值.style.color = '#ffb400';
      }
    } else {
      值地区.style.opacity = '1';
      值地区.style.cursor = 'pointer';
      值地区.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      // 隐藏提示信息
      if (值地区值) {
        值地区值.style.display = 'none';
      }
    }
  }
}
async function 保存配置(配置数据20107) {
  try {
    if (typeof 配置数据20107.yx === 'string') 配置数据20107 = { ...配置数据20107, yx: 配置数据20107.yx.split(/[,\\r\\n]+/).map(值 => 值.trim()).filter(Boolean).join(',') };
    const 响应 = await fetch(window.CFNEW.apiBase + '/api/config', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(配置数据20107)
    });
    let 结果;
    try { 结果 = await 响应.json(); } catch {
      throw new Error(响应.status === 413 ? '配置过大，请减少优选条目或改用列表 URL' : '服务器响应格式异常（HTTP ' + 响应.status + '），请稍后重试');
    }
    if (!响应.ok || !结果 || 结果.success !== true) throw new Error(结果?.message || 结果?.error || '保存失败（HTTP ' + 响应.status + '）');
    await 加载当前配置();
    更新工作器地区状态();
    setTimeout(function () { window.location.reload(); }, 1500);
  } catch (错误) {
    显示状态('保存失败: ' + 错误.message, 'error');
    throw 错误;
  }
}

function 显示状态(消息20100, 类型20099) {
  const 状态值 = document.getElementById('statusMessage');
  if (状态值) {
    状态值.textContent = 消息20100;
    状态值.style.display = 'block';
    状态值.style.color = 类型20099 === 'success' ? '#00f0ff' : '#ff3860';
    状态值.style.borderColor = 类型20099 === 'success' ? '#00f0ff' : '#ff3860';
    setTimeout(function () {
      状态值.style.display = 'none';
    }, 3000);
  }
  // 同步在底部操作条上方弹出霓虹反馈
  if (typeof window.显示操作状态 === 'function') {
    window.显示操作状态(消息20100, 类型20099 === 'success' ? 'ok' : 'err');
  }
}
async function 重置全部配置() {
  if (confirm('确定要重置所有配置吗？这将清空所有KV配置，恢复为环境变量设置。')) {
    try {
      const 响应20098 = await fetch(window.CFNEW.apiBase + '/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(document.getElementById('freeCpu')?.disabled ? {} : { freeCpu: '' }),
          wk: '',
          d: '',
          p: '',
          yx: '',
          yxURL: '',
          s: '',
          ae: '',
          rm: '',
          qj: '',
          dkby: '',
          yxby: '',
          ev: '',
          et: '',
          ex: '',
          ech: '',
          tp: '',
          customDNS: '',
          customECHDomain: '',
          scu: '',
          epd: '',
          epi: '',
          egi: '',
          ipv4: '',
          ipv6: '',
          ispMobile: '',
          ispUnicom: '',
          ispTelecom: '',
          homepage: '',
          alpn: ''
        })
      });
      if (响应20098.status === 503) {
        显示状态('KV存储未配置，无法重置配置。', 'error');
        return;
      }
      if (!响应20098.ok) {
        const 错误文本 = await 响应20098.text();

        // 尝试解析 JSON 错误信息
        try {
          const 错误数据 = JSON.parse(错误文本);
          显示状态(错误数据.message || '重置失败', 'error');
        } catch (解析错误) {
          // 如果不是 JSON，直接显示文本
          显示状态('重置失败: ' + 错误文本, 'error');
        }
        return;
      }
      const 结果20097 = await 响应20098.json();
      显示状态(结果20097.message || '配置已重置', 结果20097.success ? 'success' : 'error');
      if (结果20097.success) {
        await 加载当前配置();
        // 更新wk地区选择状态
        更新工作器地区状态();
        // 刷新页面以更新系统状态
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      }
    } catch (错误20096) {
      显示状态('重置失败: ' + 错误20096.message, 'error');
    }
  }
}
async function 检查加密问候状态() {
  const 加密客户端问候状态值 = document.getElementById('echStatus');
  if (!加密客户端问候状态值) return;
  try {
    const 当前网址 = window.location.href;
    const 订阅网址 = window.CFNEW.subUrl;
    加密客户端问候状态值.innerHTML = 'ECH状态: <span style="color: #ffb400;">检测中...</span>';
    const 响应20095 = await fetch(订阅网址, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain'
      }
    });
    const 加密客户端问候状态头部 = 响应20095.headers.get('X-ECH-Status');
    const 加密客户端问候配置长度 = 响应20095.headers.get('X-ECH-Config-Length');
    if (加密客户端问候状态头部 === 'ENABLED') {
      加密客户端问候状态值.innerHTML = 'ECH状态: <span style="color: #00ff9d;">✅ 已启用' + (加密客户端问候配置长度 ? ' (配置长度: ' + 加密客户端问候配置长度 + ')' : '') + '</span>';
    } else {
      加密客户端问候状态值.innerHTML = 'ECH状态: <span style="color: #ffb400;">⚠️ 未启用</span>';
    }
  } catch (错误20094) {
    加密客户端问候状态值.innerHTML = 'ECH状态: <span style="color: #ff3860;">❌ 检测失败: ' + 错误20094.message + '</span>';
  }
}
document.addEventListener('DOMContentLoaded', function () {
  创建矩阵雨();
  检查系统状态();
  检查键值状态();
  检查加密问候状态();

  // ECH 开启时自动联动开启仅TLS
  const 加密客户端问候复选框 = document.getElementById('ech');
  const 端口控制 = document.getElementById('portControl');
  if (加密客户端问候复选框 && 端口控制) {
    加密客户端问候复选框.addEventListener('change', function () {
      if (this.checked) {
        // ECH 开启时，自动设置仅TLS为 yes
        端口控制.value = 'yes';
      }
      同步联动界面状态();
    });

    // 页面加载时，如果 ECH 已勾选，也自动设置仅TLS
    if (加密客户端问候复选框.checked) {
      端口控制.value = 'yes';
    }
  }

  // 监听customIP输入框变化，实时更新wk地区选择状态
  const 自定义地址输入 = document.getElementById('customIP');
  if (自定义地址输入) {
    自定义地址输入.addEventListener('input', function () {
      同步联动界面状态();
    });
  }


  const 自定义路径输入 = document.getElementById('customPath');
  if (自定义路径输入) {
    自定义路径输入.addEventListener('input', function () {
      同步联动界面状态();
    });
  }

  ['ev', 'et', 'ex'].forEach(function (协议标识) {
    const 协议开关 = document.getElementById(协议标识);
    if (协议开关) {
      协议开关.addEventListener('change', function () {
        同步联动界面状态();
      });
    }
  });

  // 阻止表单默认提交（保存按钮已统一到底部操作条）
  ['regionForm', 'otherConfigForm', 'advancedConfigForm'].forEach(function (本地值20093) {
    const 表单值 = document.getElementById(本地值20093);
    if (表单值) 表单值.addEventListener('submit', function (事件值20092) {
      事件值20092.preventDefault();
    });
  });

  // 在任意输入框按下回车，触发统一保存
  document.querySelectorAll('#configContent input[type="text"], #configContent input[type="number"]').forEach(function (本地值20091) {
    本地值20091.addEventListener('keydown', function (事件值20090) {
      if (事件值20090.key === 'Enter') {
        事件值20090.preventDefault();
        保存全部配置();
      }
    });
  });

  // 统一保存：一次性收齐所有字段
  function 收集全部配置() {
    return 收集界面配置();
  }
  async function 保存全部配置() {
    // 至少启用一个通道
    const 值值20085 = document.getElementById('ev'),
      值值20084 = document.getElementById('et'),
      值值20083 = document.getElementById('ex');
    if (值值20085 && 值值20084 && 值值20083 && !值值20085.checked && !值值20084.checked && !值值20083.checked) {
      显示操作状态('${是否值236 ? 解码64('2K3Yr9in2YLZhCDbjNqpINm+2LHZiNiq2qnZhCDYsdinINmB2LnYp9mEINqp2YbbjNivIQ==') : 解码64('6Iez5bCR6ZyA6KaB5ZCv55So5LiA5Liq5Y2P6K6u77yB')}', 'err');
      显示提示('${是否值236 ? 解码64('2K3Yr9in2YLZhCDbjNqpINm+2LHZiNiq2qnZhCDYsdinINmB2LnYp9mEINqp2YbbjNivIQ==') : 解码64('6Iez5bCR6ZyA6KaB5ZCv55So5LiA5Liq5Y2P6K6u77yB')}', 'warn');
      return;
    }
    const 本地值20082 = document.getElementById('cpBtnSaveAll');
    if (本地值20082) {
      本地值20082.classList.add('cp-action-btn-saving');
      本地值20082.disabled = true;
    }
    try {
      await 保存配置(收集全部配置());
    } finally {
      if (本地值20082) {
        本地值20082.classList.remove('cp-action-btn-saving');
        本地值20082.disabled = false;
      }
    }
  }
  window.保存全部配置 = 保存全部配置;
  function 显示操作状态(消息, 类型) {
    const 本地值20081 = document.getElementById('cpActionStatus');
    if (!本地值20081) return;
    本地值20081.textContent = 消息;
    本地值20081.classList.toggle('cp-err', 类型 === 'err');
    本地值20081.classList.add('cp-show');
    clearTimeout(显示操作状态._t);
    显示操作状态._t = setTimeout(function () {
      本地值20081.classList.remove('cp-show');
    }, 2400);
  }
  window.显示操作状态 = 显示操作状态;

  // 绑定底部统一操作条
  const 值操作值 = document.getElementById('cpActionBar');
  const 值值保存值 = document.getElementById('cpBtnSaveAll');
  if (值值保存值) 值值保存值.addEventListener('click', async function () {
    值值保存值.classList.add('cp-action-btn-saving');
    try {
      await 保存全部配置();
      if (值操作值) 值操作值.classList.remove('cp-dirty');
    } finally {
      值值保存值.classList.remove('cp-action-btn-saving');
    }
  });
  const 值值值20080 = document.getElementById('cpBtnRefresh');
  if (值值值20080) 值值值20080.addEventListener('click', async function () {
    值值值20080.classList.add('cp-action-btn-saving');
    try {
      await 加载当前配置();
      if (值操作值) 值操作值.classList.remove('cp-dirty');
      显示操作状态('${是否值236 ? 'تنظیمات تازه‌سازی شد' : '配置已刷新'}');
    } finally {
      值值值20080.classList.remove('cp-action-btn-saving');
    }
  });
  const 值值重置 = document.getElementById('cpBtnReset');
  if (值值重置) 值值重置.addEventListener('click', 重置全部配置);

  // 修改字段时把 FAB 标记为 "未保存"
  function 标记已修改() {
    if (值操作值) 值操作值.classList.add('cp-dirty');
  }
  const 已修改范围 = document.getElementById('configContent') || document;
  ['input', 'change'].forEach(function (本地值20079) {
    已修改范围.addEventListener(本地值20079, function (事件值20078) {
      const 本地值20077 = 事件值20078.target;
      if (!本地值20077 || !本地值20077.tagName) return;
      const 本地值20076 = 本地值20077.tagName.toLowerCase();
      if (本地值20076 === 'input' || 本地值20076 === 'select' || 本地值20076 === 'textarea') {
        // 跳过延迟测试相关输入，避免误触
        if (本地值20077.id && /^(latencyTestInput|fetchURLInput|latencyTestPort|randomIPCount|testThreads|ipSourceSelect)$/.test(本地值20077.id)) return;
        标记已修改();
      }
    });
  });

  // Ctrl+S / Cmd+S 触发保存
  window.addEventListener('keydown', function (事件值20075) {
    if ((事件值20075.ctrlKey || 事件值20075.metaKey) && (事件值20075.key === 's' || 事件值20075.key === 'S')) {
      事件值20075.preventDefault();
      if (值值保存值 && !值值保存值.classList.contains('cp-action-btn-saving')) {
        值值保存值.click();
      }
    }
  });
  let 测试值控制器 = null;
  let 测试结果列表 = [];
  const 开始测试值 = document.getElementById('startLatencyTest');
  const 值测试值 = document.getElementById('stopLatencyTest');
  const 测试状态 = document.getElementById('latencyTestStatus');
  const 测试结果列表值 = document.getElementById('latencyTestResults');
  const 结果列表列表 = document.getElementById('latencyResultsList');
  const 覆盖已选值 = document.getElementById('overwriteSelectedToYx');
  const 追加已选值 = document.getElementById('appendSelectedToYx');
  const 选择值值 = document.getElementById('selectAllResults');
  const 值值值 = document.getElementById('deselectAllResults');
  const 地址源选择 = document.getElementById('ipSourceSelect');
  const 手动输入值 = document.getElementById('manualInputDiv');
  const 网址获取值 = document.getElementById('urlFetchDiv');
  const 延迟测试输入 = document.getElementById('latencyTestInput');
  const 获取网址输入 = document.getElementById('fetchURLInput');
  const 延迟测试端口 = document.getElementById('latencyTestPort');
  const 随机地址数量 = document.getElementById('randomIPCount');
  const 云墙随机值 = document.getElementById('cfRandomDiv');
  const 随机数量值 = document.getElementById('randomCountDiv');
  const 生成云墙地址值 = document.getElementById('generateCFIPBtn');
  const 获取地址值 = document.getElementById('fetchIPBtn');
  if (延迟测试输入) {
    const 已保存测试输入 = localStorage.getItem('latencyTestInput');
    if (已保存测试输入) 延迟测试输入.value = 已保存测试输入;
    延迟测试输入.addEventListener('input', function () {
      localStorage.setItem('latencyTestInput', this.value);
    });
  }
  if (获取网址输入) {
    const 已保存获取网址 = localStorage.getItem('fetchURLInput');
    if (已保存获取网址) 获取网址输入.value = 已保存获取网址;
    获取网址输入.addEventListener('input', function () {
      localStorage.setItem('fetchURLInput', this.value);
    });
  }
  if (延迟测试端口) {
    const 已保存端口 = localStorage.getItem('latencyTestPort');
    if (已保存端口) 延迟测试端口.value = 已保存端口;
    延迟测试端口.addEventListener('input', function () {
      localStorage.setItem('latencyTestPort', this.value);
    });
  }
  if (随机地址数量) {
    const 已保存数量 = localStorage.getItem('randomIPCount');
    if (已保存数量) 随机地址数量.value = 已保存数量;
    随机地址数量.addEventListener('input', function () {
      localStorage.setItem('randomIPCount', this.value);
    });
    // 初始化时，如果默认是隐藏的，则禁用输入框
    if (随机数量值 && 随机数量值.style.display === 'none') {
      随机地址数量.disabled = true;
    }
  }
  const 测试线程数输入 = document.getElementById('testThreads');
  if (测试线程数输入) {
    const 已保存线程数 = localStorage.getItem('testThreads');
    if (已保存线程数) 测试线程数输入.value = 已保存线程数;
    测试线程数输入.addEventListener('input', function () {
      localStorage.setItem('testThreads', this.value);
    });
  }
  if (地址源选择) {
    const 已保存源 = localStorage.getItem('ipSourceSelect');
    const 当前源 = 已保存源 || 地址源选择.value || 'manual';
    if (已保存源) {
      地址源选择.value = 已保存源;
    }
    手动输入值.style.display = 当前源 === 'manual' ? 'block' : 'none';
    网址获取值.style.display = 当前源 === 'urlFetch' ? 'block' : 'none';
    云墙随机值.style.display = 当前源 === 'cfRandom' ? 'block' : 'none';
    随机数量值.style.display = 当前源 === 'cfRandom' ? 'block' : 'none';
    // 当隐藏时禁用输入框，避免表单验证错误
    if (随机地址数量) {
      随机地址数量.disabled = 当前源 !== 'cfRandom';
    }
  }
  const 云墙网段列表 = ['173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22'];
  function 从网段生成随机地址(网段20074) {
    const [基础地址, 前缀长度] = 网段20074.split('/');
    const 前缀 = parseInt(前缀长度);
    const 主机值 = 32 - 前缀;
    const 地址部分列表 = 基础地址.split('.').map(参数值20073 => parseInt(参数值20073));
    const 地址值 = 地址部分列表[0] << 24 | 地址部分列表[1] << 16 | 地址部分列表[2] << 8 | 地址部分列表[3];
    const 随机偏移 = Math.floor(Math.random() * Math.pow(2, 主机值));
    const 掩码 = 0xFFFFFFFF << 主机值 >>> 0;
    const 随机地址 = ((地址值 & 掩码) >>> 0) + 随机偏移 >>> 0;
    return [随机地址 >>> 24 & 0xFF, 随机地址 >>> 16 & 0xFF, 随机地址 >>> 8 & 0xFF, 随机地址 & 0xFF].join('.');
  }
  function 生成云墙随机地址(数量20072, 端口20071) {
    const 地址列表20070 = [];
    for (let 索引值20069 = 0; 索引值20069 < 数量20072; 索引值20069++) {
      const 网段 = 云墙网段列表[Math.floor(Math.random() * 云墙网段列表.length)];
      const 地址20068 = 从网段生成随机地址(网段);
      地址列表20070.push(地址20068 + ':' + 端口20071);
    }
    return 地址列表20070;
  }
  if (地址源选择) {
    地址源选择.addEventListener('change', function () {
      const 值 = this.value;
      localStorage.setItem('ipSourceSelect', 值);
      手动输入值.style.display = 值 === 'manual' ? 'block' : 'none';
      网址获取值.style.display = 值 === 'urlFetch' ? 'block' : 'none';
      云墙随机值.style.display = 值 === 'cfRandom' ? 'block' : 'none';
      随机数量值.style.display = 值 === 'cfRandom' ? 'block' : 'none';
      // 当隐藏时禁用输入框，避免表单验证错误
      if (随机地址数量) {
        随机地址数量.disabled = 值 !== 'cfRandom';
      }
    });
  }
  if (生成云墙地址值) {
    生成云墙地址值.addEventListener('click', function () {
      const 数量 = parseInt(document.getElementById('randomIPCount').value) || 20;
      const 端口20067 = document.getElementById('latencyTestPort').value || '443';
      const 地址列表 = 生成云墙随机地址(数量, 端口20067);
      document.getElementById('latencyTestInput').value = 地址列表.join(',');
      手动输入值.style.display = 'block';
      显示状态('${是否值236 ? 'تولید شد' : '已生成'} ' + 数量 + ' ${是否值236 ? 'IP تصادفی CF' : '个CF随机IP'}', 'success');
    });
  }
  if (获取地址值) {
    获取地址值.addEventListener('click', async function () {
      const 网址输入 = document.getElementById('fetchURLInput');
      const 获取网址 = 网址输入.value.trim();
      if (!获取网址) {
        显示提示('${是否值236 ? 'لطفا URL را وارد کنید' : '请输入URL'}', 'warn');
        return;
      }
      获取地址值.disabled = true;
      获取地址值.textContent = '${是否值236 ? 'در حال دریافت...' : '获取中...'}';
      try {
        // 支持多个 URL（逗号分隔）以及返回内容中逗号分隔的多个 IP/节点
        const 网址列表 = Array.from(new Set(获取网址.split(',').map(网址值20066 => 网址值20066.trim()).filter(网址值20065 => 网址值20065)));
        const 值项目列表 = [];
        for (const 网址值 of 网址列表) {
          const 响应 = await 请求优选操作('list', { url: 网址值 });
          if (!响应.ok) {
            throw new Error('HTTP ' + 响应.status + ' @ ' + 网址值);
          }
          const 文本20064 = await 响应.text();

          // 先按行分割，再在每行内按逗号分割，兼容“多行 + 逗号分隔”两种格式
          const 值网址项目列表 = 文本20064.split(/\\r?\\n/).map(行值20063 => 行值20063.trim()).filter(行值20062 => 行值20062 && !行值20062.startsWith('#')).flatMap(行值 => 行值.split(',').map(参数值20061 => 参数值20061.trim()).filter(参数值 => 参数值));
          值项目列表.push(...值网址项目列表);
        }
        if (值项目列表.length > 0) {
          document.getElementById('latencyTestInput').value = 值项目列表.join(',');
          手动输入值.style.display = 'block';
          显示状态('${是否值236 ? 'دریافت شد' : '已获取'} ' + 值项目列表.length + ' ${是否值236 ? 'IP' : '个IP'}', 'success');
        } else {
          显示状态('${是否值236 ? 'داده‌ای یافت نشد' : '未获取到数据'}', 'error');
        }
      } catch (错误20060) {
        显示状态('${是否值236 ? 'خطا در دریافت' : '获取失败'}: ' + 错误20060.message, 'error');
      } finally {
        获取地址值.disabled = false;
        获取地址值.textContent = '⬇ ${是否值236 ? 'دریافت IP' : '获取IP'}';
      }
    });
  }
  if (开始测试值) {
    开始测试值.addEventListener('click', async function () {
      const 输入值20059 = document.getElementById('latencyTestInput');
      const 端口值 = document.getElementById('latencyTestPort');
      const 线程数值 = document.getElementById('testThreads');
      const 输入值 = 输入值20059.value.trim();
      const 默认端口 = 端口值.value || '443';
      const 线程数 = parseInt(线程数值.value) || 5;
      if (!输入值) {
        显示状态('${是否值236 ? 'لطفا IP یا دامنه وارد کنید' : '请输入IP或域名'}', 'error');
        return;
      }
      const 本地值20058 = 输入值.split(',').map(翻译值20057 => 翻译值20057.trim()).filter(翻译值20056 => 翻译值20056);
      if (本地值20058.length === 0) return;
      开始测试值.style.display = 'none';
      值测试值.style.display = 'inline-block';
      测试状态.style.display = 'block';
      测试结果列表值.style.display = 'block';
      结果列表列表.innerHTML = '';
      测试结果列表 = [];
      if (城市筛选值) {
        城市筛选值.style.display = 'none';
      }
      测试值控制器 = new AbortController();
      let 本地值20055 = 0;
      const 本地值20054 = 本地值20058.length;
      function 解析目标(目标20053) {
        let 主机20052 = 目标20053;
        let 端口20051 = 默认端口;
        let 节点名称20050 = '';
        if (目标20053.includes('#')) {
          const 部分列表20049 = 目标20053.split('#');
          节点名称20050 = 部分列表20049[1] || '';
          主机20052 = 部分列表20049[0];
        }
        if (主机20052.split(':').length === 2 && !主机20052.startsWith('[')) {
          const 值值20048 = 主机20052.lastIndexOf(':');
          const 值端口 = 主机20052.substring(值值20048 + 1);
          if (/^[0-9]+$/.test(值端口)) {
            端口20051 = 值端口;
            主机20052 = 主机20052.substring(0, 值值20048);
          }
        } else if (主机20052.includes(']:')) {
          const 部分列表20047 = 主机20052.split(']:');
          主机20052 = 部分列表20047[0] + ']';
          端口20051 = 部分列表20047[1];
        }
        return {
          host: 主机20052,
          port: 端口20051,
          nodeName: 节点名称20050
        };
      }
      function 渲染结果(结果20046, 索引20045, 值值20044 = true) {
        // 只展示在线优选成功的结果，失败/超时的不再显示
        if (!结果20046.success) {
          return null;
        }
        const 结果项目 = document.createElement('div');
        结果项目.style.cssText = 'display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #003300; gap: 10px;';
        结果项目.dataset.index = 索引20045;
        结果项目.dataset.colo = 结果20046.colo || '';
        if (!值值20044) {
          结果项目.style.display = 'none';
        }
        const 复选框20043 = document.createElement('input');
        复选框20043.type = 'checkbox';
        复选框20043.checked = true;
        复选框20043.disabled = false;
        复选框20043.dataset.index = 索引20045;
        复选框20043.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
        const 本地值20042 = document.createElement('div');
        本地值20042.style.cssText = 'flex: 1; font-family: monospace; font-size: 13px;';
        const 机房名称20041 = 结果20046.colo ? 获取机房名称(结果20046.colo) : '';
        const 机房显示 = 机房名称20041 ? ' <span style="color: #00aaff;">[' + 机房名称20041 + ']</span>' : '';
        本地值20042.innerHTML = '<span style="color: #00f0ff;">' + 结果20046.host + ':' + 结果20046.port + '</span>' + 机房显示 + ' <span style="color: #ffff00;">' + 结果20046.latency + 'ms</span>';
        结果项目.appendChild(复选框20043);
        结果项目.appendChild(本地值20042);
        结果列表列表.appendChild(结果项目);
        return 结果项目;
      }
      async function 测试单项(目标) {
        if (测试值控制器.signal.aborted) return null;
        const {
          host: 主机20040,
          port: 端口20039,
          nodeName: 节点名称
        } = 解析目标(目标);
        const 结果20038 = await 测试延迟(主机20040, 端口20039, 测试值控制器.signal);
        结果20038.host = 主机20040;
        结果20038.port = 端口20039;
        结果20038.customNodeName = 节点名称;
        结果20038.nodeName = 结果20038.success && 结果20038.colo ? 节点名称 || 'CF-' + 结果20038.colo : 节点名称 || 主机20040;
        return 结果20038;
      }
      for (let 索引值20037 = 0; 索引值20037 < 本地值20054; 索引值20037 += 线程数) {
        if (测试值控制器.signal.aborted) break;
        const 本地值20036 = 本地值20058.slice(索引值20037, Math.min(索引值20037 + 线程数, 本地值20054));
        测试状态.textContent = '${是否值236 ? 'در حال تست' : '测试中'}: ' + (索引值20037 + 1) + '-' + Math.min(索引值20037 + 线程数, 本地值20054) + '/' + 本地值20054 + ' (${是否值236 ? 'رشته‌ها' : '线程'}: ' + 线程数 + ')';
        const 结果列表 = await Promise.all(本地值20036.map(翻译值 => 测试单项(翻译值)));
        for (const 结果20035 of 结果列表) {
          if (结果20035) {
            const 索引20034 = 测试结果列表.length;
            测试结果列表.push(结果20035);
            渲染结果(结果20035, 索引20034);
            本地值20055++;
          }
        }
      }
      测试状态.textContent = '${是否值236 ? 'تست کامل شد' : '测试完成'}: ' + 本地值20055 + '/' + 本地值20054;
      开始测试值.style.display = 'inline-block';
      值测试值.style.display = 'none';

      // 更新城市选择器
      更新城市筛选();
    });
  }
  if (值测试值) {
    值测试值.addEventListener('click', function () {
      if (测试值控制器) {
        测试值控制器.abort();
      }
      开始测试值.style.display = 'inline-block';
      值测试值.style.display = 'none';
      测试状态.textContent = '${是否值236 ? 'تست متوقف شد' : '测试已停止'}';
    });
  }
  if (选择值值) {
    选择值值.addEventListener('click', function () {
      const 本地值20033 = 结果列表列表.querySelectorAll('input[type="checkbox"]:not(:disabled)');
      本地值20033.forEach(本地值20032 => 本地值20032.checked = true);
    });
  }
  if (值值值) {
    值值值.addEventListener('click', function () {
      const 本地值20031 = 结果列表列表.querySelectorAll('input[type="checkbox"]');
      本地值20031.forEach(本地值20030 => 本地值20030.checked = false);
    });
  }

  // 获取选中项的通用函数
  function 获取已选项目() {
    const 本地值20029 = 结果列表列表.querySelectorAll('input[type="checkbox"]:checked');
    if (本地值20029.length === 0) {
      显示状态('${是否值236 ? 'لطفا حداقل یک مورد انتخاب کنید' : '请至少选择一项'}', 'error');
      return null;
    }
    const 已选项目列表20028 = [];
    本地值20029.forEach(本地值20027 => {
      const 索引20026 = parseInt(本地值20027.dataset.index);
      const 结果20025 = 测试结果列表[索引20026];
      if (结果20025 && 结果20025.success) {
        const 机房名称 = 结果20025.customNodeName || (结果20025.colo ? 获取机房名称(结果20025.colo) : 结果20025.nodeName);
        const 安全主机 = 结果20025.host.includes(':') && !结果20025.host.startsWith('[') ? '[' + 结果20025.host + ']' : 结果20025.host;
        const 项目字符串 = 安全主机 + ':' + 结果20025.port + '#' + 机房名称;
        已选项目列表20028.push(项目字符串);
      }
    });
    return 已选项目列表20028;
  }

  // 覆盖添加
  if (覆盖已选值) {
    覆盖已选值.addEventListener('click', async function () {
      const 已选项目列表20024 = 获取已选项目();
      if (!已选项目列表20024 || 已选项目列表20024.length === 0) return;
      const 值输入20023 = document.getElementById('yx');
      const 新值20022 = 已选项目列表20024.join('\\n');
      值输入20023.value = 新值20022;
      覆盖已选值.disabled = true;
      追加已选值.disabled = true;
      覆盖已选值.textContent = '${是否值236 ? 'در حال ذخیره...' : '保存中...'}';
      try {
        const 配置数据20021 = {
          p: document.getElementById('customIP').value,
          yx: 新值20022,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await 保存配置(配置数据20021);
        显示状态('${是否值236 ? 'موفقیت‌آمیز بود' : '已覆盖'} ' + 已选项目列表20024.length + ' ${是否值236 ? 'مورد و ذخیره شد' : '项并已保存'}', 'success');
      } catch (错误20020) {
        显示状态('${是否值236 ? 'خطا در ذخیره' : '保存失败'}: ' + 错误20020.message, 'error');
      } finally {
        覆盖已选值.disabled = false;
        追加已选值.disabled = false;
        覆盖已选值.textContent = '${是否值236 ? '覆盖添加' : '覆盖添加'}';
      }
    });
  }

  // 追加添加
  if (追加已选值) {
    追加已选值.addEventListener('click', async function () {
      const 已选项目列表 = 获取已选项目();
      if (!已选项目列表 || 已选项目列表.length === 0) return;
      const 值输入 = document.getElementById('yx');
      const 当前值 = 值输入.value.trim();
      const 新项目列表 = 已选项目列表.join('\\n');
      const 新值 = 当前值 ? 当前值 + '\\n' + 新项目列表 : 新项目列表;
      值输入.value = 新值;
      覆盖已选值.disabled = true;
      追加已选值.disabled = true;
      追加已选值.textContent = '${是否值236 ? 'در حال ذخیره...' : '保存中...'}';
      try {
        const 配置数据 = {
          p: document.getElementById('customIP').value,
          yx: 新值,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await 保存配置(配置数据);
        显示状态('${是否值236 ? 'موفقیت‌آمیز بود' : '已追加'} ' + 已选项目列表.length + ' ${是否值236 ? 'مورد و ذخیره شد' : '项并已保存'}', 'success');
      } catch (错误20019) {
        显示状态('${是否值236 ? 'خطا در ذخیره' : '保存失败'}: ' + 错误20019.message, 'error');
      } finally {
        覆盖已选值.disabled = false;
        追加已选值.disabled = false;
        追加已选值.textContent = '${是否值236 ? '追加添加' : '追加添加'}';
      }
    });
  }
  function 地址转十六进制(地址) {
    const 部分列表 = 地址.split('.');
    if (部分列表.length !== 4) return null;
    let 十六进制 = '';
    for (let 索引值 = 0; 索引值 < 4; 索引值++) {
      const 数字 = parseInt(部分列表[索引值]);
      if (isNaN(数字) || 数字 < 0 || 数字 > 255) return null;
      十六进制 += 数字.toString(16).padStart(2, '0');
    }
    return 十六进制;
  }
  const 机房映射 = {
    'SJC': '🇺🇸 圣何塞',
    'LAX': '🇺🇸 洛杉矶',
    'SEA': '🇺🇸 西雅图',
    'SFO': '🇺🇸 旧金山',
    'DFW': '🇺🇸 达拉斯',
    'ORD': '🇺🇸 芝加哥',
    'IAD': '🇺🇸 华盛顿',
    'ATL': '🇺🇸 亚特兰大',
    'MIA': '🇺🇸 迈阿密',
    'DEN': '🇺🇸 丹佛',
    'PHX': '🇺🇸 凤凰城',
    'BOS': '🇺🇸 波士顿',
    'EWR': '🇺🇸 纽瓦克',
    'JFK': '🇺🇸 纽约',
    'LAS': '🇺🇸 拉斯维加斯',
    'MSP': '🇺🇸 明尼阿波利斯',
    'DTW': '🇺🇸 底特律',
    'PHL': '🇺🇸 费城',
    'CLT': '🇺🇸 夏洛特',
    'SLC': '🇺🇸 盐湖城',
    'PDX': '🇺🇸 波特兰',
    'SAN': '🇺🇸 圣地亚哥',
    'TPA': '🇺🇸 坦帕',
    'IAH': '🇺🇸 休斯顿',
    'MCO': '🇺🇸 奥兰多',
    'AUS': '🇺🇸 奥斯汀',
    'BNA': '🇺🇸 纳什维尔',
    'RDU': '🇺🇸 罗利',
    'IND': '🇺🇸 印第安纳波利斯',
    'CMH': '🇺🇸 哥伦布',
    'MCI': '🇺🇸 堪萨斯城',
    'OMA': '🇺🇸 奥马哈',
    'ABQ': '🇺🇸 阿尔伯克基',
    'OKC': '🇺🇸 俄克拉荷马城',
    'MEM': '🇺🇸 孟菲斯',
    'JAX': '🇺🇸 杰克逊维尔',
    'RIC': '🇺🇸 里士满',
    'BUF': '🇺🇸 布法罗',
    'PIT': '🇺🇸 匹兹堡',
    'CLE': '🇺🇸 克利夫兰',
    'CVG': '🇺🇸 辛辛那提',
    'MKE': '🇺🇸 密尔沃基',
    'STL': '🇺🇸 圣路易斯',
    'SAT': '🇺🇸 圣安东尼奥',
    'HNL': '🇺🇸 檀香山',
    'ANC': '🇺🇸 安克雷奇',
    'SMF': '🇺🇸 萨克拉门托',
    'ONT': '🇺🇸 安大略',
    'OAK': '🇺🇸 奥克兰',
    'HKG': '🇭🇰 香港',
    'TPE': '🇹🇼 台北',
    'TSA': '🇹🇼 台北松山',
    'KHH': '🇹🇼 高雄',
    'NRT': '🇯🇵 东京成田',
    'HND': '🇯🇵 东京羽田',
    'KIX': '🇯🇵 大阪关西',
    'ITM': '🇯🇵 大阪伊丹',
    'NGO': '🇯🇵 名古屋',
    'FUK': '🇯🇵 福冈',
    'CTS': '🇯🇵 札幌',
    'OKA': '🇯🇵 冲绳',
    'ICN': '🇰🇷 首尔仁川',
    'GMP': '🇰🇷 首尔金浦',
    'PUS': '🇰🇷 釜山',
    'SIN': '🇸🇬 新加坡',
    'BKK': '🇹🇭 曼谷',
    'DMK': '🇹🇭 曼谷廊曼',
    'KUL': '🇲🇾 吉隆坡',
    'CGK': '🇮🇩 雅加达',
    'MNL': '🇵🇭 马尼拉',
    'CEB': '🇵🇭 宿务',
    'HAN': '🇻🇳 河内',
    'SGN': '🇻🇳 胡志明',
    'DAD': '🇻🇳 岘港',
    'RGN': '🇲🇲 仰光',
    'PNH': '🇰🇭 金边',
    'REP': '🇰🇭 暹粒',
    'VTE': '🇱🇦 万象',
    'BOM': '🇮🇳 孟买',
    'DEL': '🇮🇳 新德里',
    'MAA': '🇮🇳 金奈',
    'BLR': '🇮🇳 班加罗尔',
    'CCU': '🇮🇳 加尔各答',
    'HYD': '🇮🇳 海得拉巴',
    'AMD': '🇮🇳 艾哈迈达巴德',
    'COK': '🇮🇳 科钦',
    'PNQ': '🇮🇳 浦那',
    'GOI': '🇮🇳 果阿',
    'CMB': '🇱🇰 科伦坡',
    'DAC': '🇧🇩 达卡',
    'KTM': '🇳🇵 加德满都',
    'ISB': '🇵🇰 伊斯兰堡',
    'KHI': '🇵🇰 卡拉奇',
    'LHE': '🇵🇰 拉合尔',
    'LHR': '🇬🇧 伦敦希思罗',
    'LGW': '🇬🇧 伦敦盖特威克',
    'STN': '🇬🇧 伦敦斯坦斯特德',
    'LTN': '🇬🇧 伦敦卢顿',
    'MAN': '🇬🇧 曼彻斯特',
    'EDI': '🇬🇧 爱丁堡',
    'BHX': '🇬🇧 伯明翰',
    'CDG': '🇫🇷 巴黎戴高乐',
    'ORY': '🇫🇷 巴黎奥利',
    'MRS': '🇫🇷 马赛',
    'LYS': '🇫🇷 里昂',
    'NCE': '🇫🇷 尼斯',
    'FRA': '🇩🇪 法兰克福',
    'MUC': '🇩🇪 慕尼黑',
    'TXL': '🇩🇪 柏林',
    'BER': '🇩🇪 柏林勃兰登堡',
    'HAM': '🇩🇪 汉堡',
    'DUS': '🇩🇪 杜塞尔多夫',
    'CGN': '🇩🇪 科隆',
    'STR': '🇩🇪 斯图加特',
    'AMS': '🇳🇱 阿姆斯特丹',
    'BRU': '🇧🇪 布鲁塞尔',
    'LUX': '🇱🇺 卢森堡',
    'ZRH': '🇨🇭 苏黎世',
    'GVA': '🇨🇭 日内瓦',
    'BSL': '🇨🇭 巴塞尔',
    'VIE': '🇦🇹 维也纳',
    'PRG': '🇨🇿 布拉格',
    'BUD': '🇭🇺 布达佩斯',
    'WAW': '🇵🇱 华沙',
    'KRK': '🇵🇱 克拉科夫',
    'MXP': '🇮🇹 米兰马尔彭萨',
    'LIN': '🇮🇹 米兰利纳特',
    'FCO': '🇮🇹 罗马',
    'VCE': '🇮🇹 威尼斯',
    'NAP': '🇮🇹 那不勒斯',
    'FLR': '🇮🇹 佛罗伦萨',
    'BGY': '🇮🇹 贝加莫',
    'MAD': '🇪🇸 马德里',
    'BCN': '🇪🇸 巴塞罗那',
    'PMI': '🇪🇸 帕尔马',
    'AGP': '🇪🇸 马拉加',
    'VLC': '🇪🇸 瓦伦西亚',
    'SVQ': '🇪🇸 塞维利亚',
    'BIO': '🇪🇸 毕尔巴鄂',
    'LIS': '🇵🇹 里斯本',
    'OPO': '🇵🇹 波尔图',
    'FAO': '🇵🇹 法鲁',
    'DUB': '🇮🇪 都柏林',
    'CPH': '🇩🇰 哥本哈根',
    'ARN': '🇸🇪 斯德哥尔摩',
    'GOT': '🇸🇪 哥德堡',
    'OSL': '🇳🇴 奥斯陆',
    'BGO': '🇳🇴 卑尔根',
    'HEL': '🇫🇮 赫尔辛基',
    'RIX': '🇱🇻 里加',
    'TLL': '🇪🇪 塔林',
    'VNO': '🇱🇹 维尔纽斯',
    'ATH': '🇬🇷 雅典',
    'SKG': '🇬🇷 塞萨洛尼基',
    'SOF': '🇧🇬 索非亚',
    'OTP': '🇷🇴 布加勒斯特',
    'BEG': '🇷🇸 贝尔格莱德',
    'ZAG': '🇭🇷 萨格勒布',
    'LJU': '🇸🇮 卢布尔雅那',
    'KBP': '🇺🇦 基辅',
    'IEV': '🇺🇦 基辅茹良尼',
    'ODS': '🇺🇦 敖德萨',
    'SVO': '🇷🇺 莫斯科谢列梅捷沃',
    'DME': '🇷🇺 莫斯科多莫杰多沃',
    'VKO': '🇷🇺 莫斯科伏努科沃',
    'LED': '🇷🇺 圣彼得堡',
    'IST': '🇹🇷 伊斯坦布尔',
    'SAW': '🇹🇷 伊斯坦布尔萨比哈',
    'ESB': '🇹🇷 安卡拉',
    'AYT': '🇹🇷 安塔利亚',
    'ADB': '🇹🇷 伊兹密尔',
    'TLV': '🇮🇱 特拉维夫',
    'AMM': '🇯🇴 安曼',
    'BEY': '🇱🇧 贝鲁特',
    'BAH': '🇧🇭 巴林',
    'KWI': '🇰🇼 科威特',
    'DXB': '🇦🇪 迪拜',
    'AUH': '🇦🇪 阿布扎比',
    'SHJ': '🇦🇪 沙迦',
    'DOH': '🇶🇦 多哈',
    'MCT': '🇴🇲 马斯喀特',
    'RUH': '🇸🇦 利雅得',
    'JED': '🇸🇦 吉达',
    'DMM': '🇸🇦 达曼',
    'CAI': '🇪🇬 开罗',
    'HBE': '🇪🇬 亚历山大',
    'SSH': '🇪🇬 沙姆沙伊赫',
    'CMN': '🇲🇦 卡萨布兰卡',
    'RAK': '🇲🇦 马拉喀什',
    'TUN': '🇹🇳 突尼斯',
    'ALG': '🇩🇿 阿尔及尔',
    'LOS': '🇳🇬 拉各斯',
    'ABV': '🇳🇬 阿布贾',
    'ACC': '🇬🇭 阿克拉',
    'NBO': '🇰🇪 内罗毕',
    'MBA': '🇰🇪 蒙巴萨',
    'ADD': '🇪🇹 亚的斯亚贝巴',
    'DAR': '🇹🇿 达累斯萨拉姆',
    'JNB': '🇿🇦 约翰内斯堡',
    'CPT': '🇿🇦 开普敦',
    'DUR': '🇿🇦 德班',
    'HRE': '🇿🇼 哈拉雷',
    'LUN': '🇿🇲 卢萨卡',
    'MRU': '🇲🇺 毛里求斯',
    'SEZ': '🇸🇨 塞舌尔',
    'SYD': '🇦🇺 悉尼',
    'MEL': '🇦🇺 墨尔本',
    'BNE': '🇦🇺 布里斯班',
    'PER': '🇦🇺 珀斯',
    'ADL': '🇦🇺 阿德莱德',
    'CBR': '🇦🇺 堪培拉',
    'OOL': '🇦🇺 黄金海岸',
    'CNS': '🇦🇺 凯恩斯',
    'AKL': '🇳🇿 奥克兰',
    'WLG': '🇳🇿 惠灵顿',
    'CHC': '🇳🇿 基督城',
    'ZQN': '🇳🇿 皇后镇',
    'NAN': '🇫🇯 楠迪',
    'PPT': '🇵🇫 帕皮提',
    'GUM': '🇬🇺 关岛',
    'GRU': '🇧🇷 圣保罗瓜鲁柳斯',
    'CGH': '🇧🇷 圣保罗孔戈尼亚斯',
    'GIG': '🇧🇷 里约热内卢',
    'BSB': '🇧🇷 巴西利亚',
    'CNF': '🇧🇷 贝洛奥里藏特',
    'POA': '🇧🇷 阿雷格里港',
    'CWB': '🇧🇷 库里蒂巴',
    'FOR': '🇧🇷 福塔莱萨',
    'REC': '🇧🇷 累西腓',
    'SSA': '🇧🇷 萨尔瓦多',
    'EZE': '🇦🇷 布宜诺斯艾利斯',
    'AEP': '🇦🇷 布宜诺斯艾利斯城',
    'COR': '🇦🇷 科尔多瓦',
    'MDZ': '🇦🇷 门多萨',
    'SCL': '🇨🇱 圣地亚哥',
    'LIM': '🇵🇪 利马',
    'BOG': '🇨🇴 波哥大',
    'MDE': '🇨🇴 麦德林',
    'CLO': '🇨🇴 卡利',
    'UIO': '🇪🇨 基多',
    'GYE': '🇪🇨 瓜亚基尔',
    'CCS': '🇻🇪 加拉加斯',
    'MVD': '🇺🇾 蒙得维的亚',
    'ASU': '🇵🇾 亚松森',
    'PTY': '🇵🇦 巴拿马城',
    'SJO': '🇨🇷 圣何塞',
    'GUA': '🇬🇹 危地马拉城',
    'SAL': '🇸🇻 圣萨尔瓦多',
    'TGU': '🇭🇳 特古西加尔巴',
    'MGA': '🇳🇮 马那瓜',
    'BZE': '🇧🇿 伯利兹城',
    'MEX': '🇲🇽 墨西哥城',
    'GDL': '🇲🇽 瓜达拉哈拉',
    'MTY': '🇲🇽 蒙特雷',
    'CUN': '🇲🇽 坎昆',
    'TIJ': '🇲🇽 蒂华纳',
    'SJD': '🇲🇽 圣何塞德尔卡沃',
    'YYZ': '🇨🇦 多伦多',
    'YVR': '🇨🇦 温哥华',
    'YUL': '🇨🇦 蒙特利尔',
    'YYC': '🇨🇦 卡尔加里',
    'YEG': '🇨🇦 埃德蒙顿',
    'YOW': '🇨🇦 渥太华',
    'YWG': '🇨🇦 温尼伯',
    'YHZ': '🇨🇦 哈利法克斯',
    'HAV': '🇨🇺 哈瓦那',
    'SJU': '🇵🇷 圣胡安',
    'SDQ': '🇩🇴 圣多明各',
    'PAP': '🇭🇹 太子港',
    'KIN': '🇯🇲 金斯顿',
    'NAS': '🇧🇸 拿骚',
    'MBJ': '🇯🇲 蒙特哥贝'
  };
  function 获取机房名称(机房20018) {
    return 机房映射[机房20018] || 机房20018;
  }

  // 城市筛选相关函数
  const 城市筛选值 = document.getElementById('cityFilterContainer');
  const 城市值值 = document.getElementById('cityCheckboxesContainer');
  function 更新城市筛选() {
    if (!城市筛选值 || !城市值值) return;

    // 从测试结果中提取所有可用的城市
    const 城市映射 = new Map();
    测试结果列表.forEach((结果20017, 索引20016) => {
      if (结果20017.success && 结果20017.colo) {
        const 机房20015 = 结果20017.colo;
        if (!城市映射.has(机房20015)) {
          城市映射.set(机房20015, {
            colo: 机房20015,
            name: 获取机房名称(机房20015),
            count: 0
          });
        }
        城市映射.get(机房20015).count++;
      }
    });
    if (城市映射.size === 0) {
      城市筛选值.style.display = 'none';
      return;
    }
    城市筛选值.style.display = 'block';
    城市值值.innerHTML = '';

    // 按城市名称排序
    const 城市列表 = Array.from(城市映射.values()).sort((甲值20014, 乙值20013) => 甲值20014.name.localeCompare(乙值20013.name));
    城市列表.forEach(城市 => {
      const 标签 = document.createElement('label');
      标签.style.cssText = 'display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff; font-size: 0.85rem; padding: 4px 8px; background: rgba(20, 5, 50, 0.4); border: 1px solid #7aa9c4; border-radius: 4px;';
      const 复选框20012 = document.createElement('input');
      复选框20012.type = 'checkbox';
      复选框20012.value = 城市.colo;
      复选框20012.checked = true;
      复选框20012.dataset.colo = 城市.colo;
      复选框20012.style.cssText = 'margin-right: 6px; width: 16px; height: 16px; cursor: pointer;';
      const 本地值20011 = document.createElement('span');
      本地值20011.textContent = 城市.name + ' (' + 城市.count + ')';
      标签.appendChild(复选框20012);
      标签.appendChild(本地值20011);
      城市值值.appendChild(标签);
      复选框20012.addEventListener('change', 按城市筛选结果);
    });

    // 监听筛选模式变化
    const 筛选值值 = document.querySelectorAll('input[name="cityFilterMode"]');
    筛选值值.forEach(单选框 => {
      单选框.addEventListener('change', function () {
        if (this.value === 'all') {
          // 切换到"全部城市"模式时，自动选中所有城市复选框
          const 城市值20010 = 城市值值.querySelectorAll('input[type="checkbox"]');
          城市值20010.forEach(本地值20009 => {
            本地值20009.checked = true;
            本地值20009.disabled = false;
          });
        }
        按城市筛选结果();
      });
    });
  }
  function 按城市筛选结果() {
    if (!结果列表列表 || !城市值值) return;
    const 筛选值 = document.querySelector('input[name="cityFilterMode"]:checked')?.value || 'all';
    const 结果项目列表 = 结果列表列表.querySelectorAll('[data-index]');
    const 城市值 = 城市值值.querySelectorAll('input[type="checkbox"]');
    if (筛选值 === 'fastest10') {
      // 只选择最快的10个
      const 值结果列表 = 测试结果列表.map((结果, 索引20008) => ({
        result: 结果,
        index: 索引20008
      })).filter(项目20007 => 项目20007.result.success).sort((甲值, 乙值) => 甲值.result.latency - 乙值.result.latency).slice(0, 10);
      const 最快索引集合 = new Set(值结果列表.map(项目20006 => 项目20006.index));
      结果项目列表.forEach(项目20005 => {
        const 索引 = parseInt(项目20005.dataset.index);
        const 复选框20004 = 项目20005.querySelector('input[type="checkbox"]');
        if (最快索引集合.has(索引)) {
          项目20005.style.display = 'flex';
          if (复选框20004) 复选框20004.checked = true;
        } else {
          项目20005.style.display = 'none';
          if (复选框20004) 复选框20004.checked = false;
        }
      });

      // 禁用城市复选框
      城市值.forEach(本地值20003 => 本地值20003.disabled = true);
    } else {
      // 根据选中的城市筛选
      const 已选城市列表 = new Set();
      城市值.forEach(本地值20002 => {
        if (本地值20002.checked) {
          已选城市列表.add(本地值20002.value);
        }
      });

      // 如果所有城市都被选中（或没有选中任何城市），显示所有结果
      const 值值20001 = 城市值.length > 0 && 已选城市列表.size === 城市值.length;
      const 值值 = 已选城市列表.size === 0;
      结果项目列表.forEach(项目 => {
        const 机房20000 = 项目.dataset.colo || '';
        const 复选框 = 项目.querySelector('input[type="checkbox"]');
        if (值值20001 || 值值 || 已选城市列表.has(机房20000)) {
          项目.style.display = 'flex';
          // 同步更新结果项复选框的选中状态
          if (复选框) {
            if (值值20001) {
              // 所有城市都选中时，所有结果项复选框都选中
              复选框.checked = true;
            } else if (值值) {
              // 没有选中任何城市时，所有结果项复选框都取消选中
              复选框.checked = false;
            } else {
              // 根据城市选择状态同步复选框
              复选框.checked = 已选城市列表.has(机房20000);
            }
          }
        } else {
          项目.style.display = 'none';
          // 取消选中隐藏的结果项复选框
          if (复选框) {
            复选框.checked = false;
          }
        }
      });

      // 启用城市复选框
      城市值.forEach(本地值 => 本地值.disabled = false);
    }
  }
  async function 测试延迟(主机, 端口, 信号) {
    try {
      const 响应 = await 请求优选操作('probe', { address: 主机.replace(/^\\[|\\]$/g, ''), port: Number(端口) }, 信号);
      const 结果 = await 响应.json();
      if (!响应.ok) throw new Error(结果.message || '检测失败');
      return 结果;
    } catch (错误) {
      return { success: false, latency: -1, error: 错误.message, colo: '' };
    }
  }

});
</script>
    </body>
    </html>`;
  return new Response(值页面, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

function 获取叉HTTP填充标识(标识串) {
  return { 头: 标识串.slice(1, 7), 键: '_' + 标识串.slice(25, 31) };
}

async function 获取值解析新地址列表() {
  const 网址113 = 优选地址源;
  try {
    const 网址列表112 = 网址113.includes(',') ? 网址113.split(',').map(网址值111 => 网址值111.trim()).filter(网址值 => 网址值) : [网址113];
    const 接口结果列表 = await 获取优选接口(网址列表112, '443', 5000);
    if (接口结果列表.length > 0) {
      const 结果列表110 = [];
      const 正则 = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
      for (const 项目109 of 接口结果列表) {
        const 本地值108 = 项目109.match(正则);
        if (本地值108) {
          结果列表110.push({
            ip: 规范化节点主机(本地值108[1]),
            port: parseInt(本地值108[2] || '443', 10),
            name: 本地值108[3]?.trim() || 本地值108[1]
          });
        }
      }
      return 结果列表110;
    }
    const 响应107 = await fetch(网址113);
    if (!响应107.ok) return [];
    const 文本106 = await 响应107.text();
    const 结果列表105 = [];
    const 行列表104 = 文本106.trim().replace(/\r/g, "").split('\n');
    const 值正则 = /^([^:]+):(\d+)#(.*)$/;
    for (const 行103 of 行列表104) {
      const 值行 = 行103.trim();
      if (!值行) continue;
      const 本地值102 = 值行.match(值正则);
      if (本地值102) {
        结果列表105.push({
          ip: 本地值102[1],
          port: parseInt(本地值102[2], 10),
          name: 本地值102[3].trim() || 本地值102[1]
        });
      }
    }
    return 结果列表105;
  } catch (错误101) {
    return [];
  }
}

function 生成链接列表来源新地址列表(列表100, 用户99, 工作器域名98, 加密客户端问候配置97 = null, 跳过编号96 = false, 别名命名器95 = null) {
  const 云墙超文本端口94 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const 云墙安全超文本端口93 = [443, 2053, 2083, 2087, 2096, 8443];
  const 链接列表92 = [];
  const 网页套接字路径91 = '/?ed=2048';
  const 协议 = atob('dmxlc3M=');
  const 制作节点名称90 = 别名命名器95 || 创建值节点命名器(跳过编号96);
  for (const 项目89 of 列表100) {
    const 端口88 = 项目89.port;
    const 安全地址87 = 项目89.ip.includes(':') ? `[${项目89.ip}]` : 项目89.ip;
    if (云墙安全超文本端口93.includes(端口88)) {
      const 网页套接字节点名称86 = 制作节点名称90(项目89);
      let 链接85 = `${协议}://${用户99}@${安全地址87}:${端口88}?encryption=none&security=tls&sni=${工作器域名98}&fp=chrome&type=ws&host=${工作器域名98}&path=${网页套接字路径91}`;
      if (自定义应用层协议协商) 链接85 += `&alpn=${encodeURIComponent(自定义应用层协议协商)}`;

      // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
      if (启用加密客户端问候) {
        const 域名系统值84 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
        const 加密客户端问候域名83 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
        链接85 += `&ech=${encodeURIComponent(`${加密客户端问候域名83}+${域名系统值84}`)}`;
      }
      链接85 += `#${encodeURIComponent(网页套接字节点名称86)}`;
      链接列表92.push(链接85);
    } else if (云墙超文本端口94.includes(端口88)) {
      if (!禁用非传输层安全) {
        const 网页套接字节点名称82 = 制作节点名称90(项目89);
        const 链接81 = `${协议}://${用户99}@${安全地址87}:${端口88}?encryption=none&security=none&type=ws&host=${工作器域名98}&path=${网页套接字路径91}#${encodeURIComponent(网页套接字节点名称82)}`;
        链接列表92.push(链接81);
      }
    } else {
      const 网页套接字节点名称80 = 制作节点名称90(项目89);
      let 链接79 = `${协议}://${用户99}@${安全地址87}:${端口88}?encryption=none&security=tls&sni=${工作器域名98}&fp=chrome&type=ws&host=${工作器域名98}&path=${网页套接字路径91}`;
      if (自定义应用层协议协商) 链接79 += `&alpn=${encodeURIComponent(自定义应用层协议协商)}`;

      // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
      if (启用加密客户端问候) {
        const 域名系统值78 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
        const 加密客户端问候域名77 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
        链接79 += `&ech=${encodeURIComponent(`${加密客户端问候域名77}+${域名系统值78}`)}`;
      }
      链接79 += `#${encodeURIComponent(网页套接字节点名称80)}`;
      链接列表92.push(链接79);
    }
  }
  return 链接列表92;
}

function 生成扩展超文本链接列表来源源(列表76, 用户75, 工作器域名74, 加密客户端问候配置73 = null, 跳过编号72 = false, 别名命名器71 = null) {
  const 链接列表70 = [];
  const 节点路径 = 用户75.substring(0, 8);
  const 制作节点名称69 = 别名命名器71 || 创建值节点命名器(跳过编号72);
  for (const 项目68 of 列表76) {
    const 安全地址67 = 项目68.ip.includes(':') ? `[${项目68.ip}]` : 项目68.ip;
    const 端口66 = 项目68.port || 443;
    const 网页套接字节点名称65 = 制作节点名称69(项目68);
    const 参数 = new URLSearchParams({
      encryption: 'none',
      security: 'tls',
      sni: 工作器域名74,
      fp: 'chrome',
      type: 'xhttp',
      host: 工作器域名74,
      path: `/${节点路径}`,
      mode: 'stream-one'
    });
    const { 头: 叉填充头65, 键: 叉填充键65 } = 获取叉HTTP填充标识(用户75);
    参数.set('extra', JSON.stringify({
      xPaddingObfsMode: true,
      xPaddingMethod: 'tokenish',
      xPaddingPlacement: 'queryInHeader',
      xPaddingHeader: 叉填充头65,
      xPaddingKey: 叉填充键65
    }));
    // 单流双向传输需要 HTTP/2，不能跟随其他协议的仅 HTTP/1.1 选项。
    参数.set('alpn', 'h2');
    if (启用加密客户端问候) {
      const 域名系统值64 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
      const 加密客户端问候域名63 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
      参数.set('ech', `${加密客户端问候域名63}+${域名系统值64}`);
    }
    链接列表70.push(`${解码64('dmxlc3M6Ly8=')}${用户75}@${安全地址67}:${端口66}?${参数.toString()}#${encodeURIComponent(网页套接字节点名称65)}`);
  }
  return 链接列表70;
}

async function 生成木马链接列表来源新地址列表(列表, 用户, 工作器域名, 加密客户端问候配置 = null, 跳过编号 = false, 别名命名器 = null) {
  const 云墙超文本端口 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const 云墙安全超文本端口 = [443, 2053, 2083, 2087, 2096, 8443];
  const 链接列表 = [];
  const 网页套接字路径 = '/?ed=2048';
  const 密码 = 传输路径 || 用户;
  const 制作节点名称 = 别名命名器 || 创建值节点命名器(跳过编号);
  for (const 项目62 of 列表) {
    const 端口61 = 项目62.port;
    const 安全地址 = 项目62.ip.includes(':') ? `[${项目62.ip}]` : 项目62.ip;
    if (云墙安全超文本端口.includes(端口61)) {
      const 网页套接字节点名称60 = 制作节点名称(项目62);
      let 链接59 = `${atob('dHJvamFuOi8v')}${密码}@${安全地址}:${端口61}?security=tls&sni=${工作器域名}&fp=chrome&type=ws&host=${工作器域名}&path=${网页套接字路径}`;
      if (自定义应用层协议协商) 链接59 += `&alpn=${encodeURIComponent(自定义应用层协议协商)}`;

      // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
      if (启用加密客户端问候) {
        const 域名系统值58 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
        const 加密客户端问候域名57 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
        链接59 += `&ech=${encodeURIComponent(`${加密客户端问候域名57}+${域名系统值58}`)}`;
      }
      链接59 += `#${encodeURIComponent(网页套接字节点名称60)}`;
      链接列表.push(链接59);
    } else if (云墙超文本端口.includes(端口61)) {
      if (!禁用非传输层安全) {
        const 网页套接字节点名称56 = 制作节点名称(项目62);
        const 链接55 = `${atob('dHJvamFuOi8v')}${密码}@${安全地址}:${端口61}?security=none&type=ws&host=${工作器域名}&path=${网页套接字路径}#${encodeURIComponent(网页套接字节点名称56)}`;
        链接列表.push(链接55);
      }
    } else {
      const 网页套接字节点名称 = 制作节点名称(项目62);
      let 链接 = `${atob('dHJvamFuOi8v')}${密码}@${安全地址}:${端口61}?security=tls&sni=${工作器域名}&fp=chrome&type=ws&host=${工作器域名}&path=${网页套接字路径}`;
      if (自定义应用层协议协商) 链接 += `&alpn=${encodeURIComponent(自定义应用层协议协商)}`;

      // 如果启用了ECH，添加ech参数（ECH需要伪装成Chrome浏览器）
      if (启用加密客户端问候) {
        const 域名系统值 = 自定义域名系统 || 'https://223.5.5.5/dns-query';
        const 加密客户端问候域名 = 自定义加密客户端问候域名 || 'cloudflare-ech.com';
        链接 += `&ech=${encodeURIComponent(`${加密客户端问候域名}+${域名系统值}`)}`;
      }
      链接 += `#${encodeURIComponent(网页套接字节点名称)}`;
      链接列表.push(链接);
    }
  }
  return 链接列表;
}

function 更新配置值() {
  const 有效配置 = 获取有效配置快照();
  const 手动地区 = 有效配置.wk;
  if (手动地区 && 手动地区.trim()) {
    手动工作器地区 = 手动地区.trim().toUpperCase();
    当前工作器地区 = 手动工作器地区;
  } else {
    const 本地值 = 有效配置.p;
    if (本地值 && 本地值.trim()) {
      当前工作器地区 = 'CUSTOM';
    } else {
      手动工作器地区 = '';
      当前工作器地区 = '';
    }
  }
  启用地区匹配 = !(有效配置.rm && 有效配置.rm.toLowerCase() === 'no');
  启用明文 = 有效配置.ev === 'yes';
  启用木马 = 有效配置.et === 'yes';
  启用扩展传输 = 有效配置.ex === 'yes';
  传输路径 = 有效配置.tp || '';
  订阅转换接口 = 有效配置.scu || 配置默认值.scu;
  启用优选域名 = 有效配置.epd === 'yes';
  启用优选地址 = 有效配置.epi === 'yes';
  启用仓库优选 = 有效配置.egi === 'yes';
  启用原生地址 = 有效配置.ena === 'yes';
  启用家宽链式 = 有效配置.jk === 'yes';
  启用加密客户端问候 = 有效配置.ech === 'yes';
  自定义域名系统 = 有效配置.customDNS || 配置默认值.customDNS;
  自定义加密客户端问候域名 = 有效配置.customECHDomain || 配置默认值.customECHDomain;
  自定义应用层协议协商 = 规范化应用层协议协商(有效配置.alpn || '');
  禁用非传输层安全 = 有效配置.dkby === 'yes' || 启用加密客户端问候;
  const 降级控制值 = (有效配置.qj || '').toLowerCase();
  启用代理降级 = 降级控制值 === 'no';
  仅走代理 = 降级控制值 === 'only';
  自定义路径 = 有效配置.d || '';
  优选地址源 = 有效配置.yxURL || '';
  回退地址 = 有效配置.p ? 有效配置.p.trim() : '';
  代理5配置 = 有效配置.s || '';
  if (代理5配置) {
    try {
      已解析代理5配置 = 解析代理配置(代理5配置);
      是否代理已启用 = true;
    } catch (错误31) {
      是否代理已启用 = false;
    }
  } else {
    已解析代理5配置 = {};
    是否代理已启用 = false;
  }
  禁用优选 = !!(有效配置.yxby && 有效配置.yxby.toLowerCase() === 'yes');
}

function 更新自定义优选来源值() {
  const 值值30 = 获取配置值('yx', '');
  if (值值30) {
    try {
      const 优选列表 = 值值30.split(/[,\r\n]+/).map(项目29 => 项目29.trim()).filter(项目28 => 项目28);
      自定义优选地址列表 = [];
      自定义优选域名列表 = [];
      优选列表.forEach(项目27 => {
        let 节点名称26 = '';
        let 地址部分25 = 项目27;
        if (项目27.includes('#')) {
          const 部分列表24 = 项目27.split('#');
          地址部分25 = 部分列表24[0].trim();
          节点名称26 = 部分列表24[1].trim();
        }
        const {
          address: 地址23,
          port: 端口22
        } = 解析地址值端口(地址部分25);
        if (!节点名称26) {
          节点名称26 = '自定义优选-' + 地址23 + (端口22 ? ':' + 端口22 : '');
        }
        if (是否有效地址(地址23)) {
          自定义优选地址列表.push({
            ip: 地址23,
            port: 端口22,
            isp: 节点名称26
          });
        } else {
          自定义优选域名列表.push({
            domain: 地址23,
            port: 端口22,
            name: 节点名称26
          });
        }
      });
    } catch (错误) {
      自定义优选地址列表 = [];
      自定义优选域名列表 = [];
    }
  } else {
    自定义优选地址列表 = [];
    自定义优选域名列表 = [];
  }
}

async function 获取优选接口(网址列表, 默认端口 = '443', 超时 = 3000) {
  if (!网址列表?.length) return [];
  const 结果列表 = new Set();
  await Promise.allSettled(网址列表.map(async 网址 => {
    try {
      const 控制器 = new AbortController();
      const 超时标识 = setTimeout(() => 控制器.abort(), 超时);
      const 响应 = await fetch(网址, {
        signal: 控制器.signal
      });
      clearTimeout(超时标识);
      let 文本 = '';
      try {
        const 缓冲 = await 响应.arrayBuffer();
        const 内容类型 = (响应.headers.get('content-type') || '').toLowerCase();
        const 字符集 = 内容类型.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';
        let 解码器列表 = ['utf-8', 'gb2312'];
        if (字符集.includes('gb') || 字符集.includes('gbk') || 字符集.includes('gb2312')) {
          解码器列表 = ['gb2312', 'utf-8'];
        }
        let 解码成功 = false;
        for (const 解码器 of 解码器列表) {
          try {
            const 已解码 = new TextDecoder(解码器).decode(缓冲);
            if (已解码 && 已解码.length > 0 && !已解码.includes('\ufffd')) {
              文本 = 已解码;
              解码成功 = true;
              break;
            } else if (已解码 && 已解码.length > 0) {
              continue;
            }
          } catch (事件值16) {
            continue;
          }
        }
        if (!解码成功) {
          文本 = await 响应.text();
        }
        if (!文本 || 文本.trim().length === 0) {
          return;
        }
      } catch (事件值15) {
        return;
      }
      const 行列表 = 文本.trim().split('\n').map(行值14 => 行值14.trim()).filter(行值 => 行值);
      const 是否值 = 行列表.length > 1 && 行列表[0].includes(',');
      const 六版地址模式 = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
      if (!是否值) {
        行列表.forEach(行13 => {
          const 井号索引 = 行13.indexOf('#');
          const [主机部分, 备注] = 井号索引 > -1 ? [行13.substring(0, 井号索引), 行13.substring(井号索引)] : [行13, ''];
          let 是否有端口 = false;
          if (主机部分.startsWith('[')) {
            是否有端口 = /\]:(\d+)$/.test(主机部分);
          } else {
            const 值索引 = 主机部分.lastIndexOf(':');
            是否有端口 = 值索引 > -1 && /^\d+$/.test(主机部分.substring(值索引 + 1));
          }
          const 端口12 = new URL(网址).searchParams.get('port') || 默认端口;
          结果列表.add(是否有端口 ? 行13 : `${主机部分}:${端口12}${备注}`);
        });
      } else {
        const 头部列表 = 行列表[0].split(',').map(头值11 => 头值11.trim());
        const 数据行列表 = 行列表.slice(1);
        if (头部列表.includes('IP地址') && 头部列表.includes('端口') && 头部列表.includes('数据中心')) {
          const 地址索引10 = 头部列表.indexOf('IP地址'),
            端口索引 = 头部列表.indexOf('端口');
          const 备注索引 = 头部列表.indexOf('国家') > -1 ? 头部列表.indexOf('国家') : 头部列表.indexOf('城市') > -1 ? 头部列表.indexOf('城市') : 头部列表.indexOf('数据中心');
          const 传输层安全索引 = 头部列表.indexOf('TLS');
          数据行列表.forEach(行9 => {
            const 列列表8 = 行9.split(',').map(丙值7 => 丙值7.trim());
            if (传输层安全索引 !== -1 && 列列表8[传输层安全索引]?.toLowerCase() !== 'true') return;
            const 包裹地址6 = 六版地址模式.test(列列表8[地址索引10]) ? `[${列列表8[地址索引10]}]` : 列列表8[地址索引10];
            结果列表.add(`${包裹地址6}:${列列表8[端口索引]}#${列列表8[备注索引]}`);
          });
        } else if (头部列表.some(头值5 => 头值5.includes('IP')) && 头部列表.some(头值4 => 头值4.includes('延迟')) && 头部列表.some(头值3 => 头值3.includes('下载速度'))) {
          const 地址索引 = 头部列表.findIndex(头值2 => 头值2.includes('IP'));
          const 延迟索引 = 头部列表.findIndex(头值1 => 头值1.includes('延迟'));
          const 速度索引 = 头部列表.findIndex(头值 => 头值.includes('下载速度'));
          const 端口 = new URL(网址).searchParams.get('port') || 默认端口;
          数据行列表.forEach(行 => {
            const 列列表 = 行.split(',').map(丙值 => 丙值.trim());
            const 包裹地址 = 六版地址模式.test(列列表[地址索引]) ? `[${列列表[地址索引]}]` : 列列表[地址索引];
            结果列表.add(`${包裹地址}:${端口}#CF优选 ${列列表[延迟索引]}ms ${列列表[速度索引]}MB/s`);
          });
        }
      }
    } catch (事件值) {}
  }));
  return Array.from(结果列表);
}

function createEngine(config, uuid) {
认证令牌 = uuid;
键值配置 = config;
更新配置值();
当前工作器地区 ||= 'CF';
更新自定义优选来源值();
return { render: request => 处理订阅值(request, uuid), subscribe: request => 处理订阅请求(request, uuid), defaults: 配置默认值 };
}
return createEngine(config, uuid);
}
