import { MockMethod } from 'vite-plugin-mock';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 内存中的配置存储（用于模拟）
let configStore: any = {
  dbHost: 'localhost',
  dbPort: '5432',
  dbName: 'uctoo',
  dbUser: 'postgres',
  stepfunApiKey: '',
  sophnetApiKey: ''
};

// 配置文件路径
const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');

// 读取配置文件
function loadConfigFromFile(): any {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取配置文件失败:', error);
  }
  return configStore;
}

// 保存配置文件
function saveConfigToFile(config: any): boolean {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    configStore = config;
    return true;
  } catch (error) {
    console.error('保存配置文件失败:', error);
    return false;
  }
}

export default [
  // 环境检测 API
  {
    url: '/api/setup/check-environment',
    method: 'get',
    response: async () => {
      const checks = [];

      // 检查 Node.js 版本
      try {
        const { stdout } = await execAsync('node --version');
        const nodeVersion = stdout.trim();
        const versionMatch = nodeVersion.match(/v(\d+)\.(\d+)\.(\d+)/);
        if (versionMatch) {
          const majorVersion = parseInt(versionMatch[1]);
          const passed = majorVersion >= 18;
          checks.push({
            name: 'nodejs',
            label: 'Node.js',
            passed,
            current: nodeVersion,
            required: '>= 18.0.0'
          });
        } else {
          checks.push({
            name: 'nodejs',
            label: 'Node.js',
            passed: false,
            current: nodeVersion,
            required: '>= 18.0.0'
          });
        }
      } catch (error) {
        checks.push({
          name: 'nodejs',
          label: 'Node.js',
          passed: false,
          current: '',
          required: '>= 18.0.0'
        });
      }

      // 检查 PostgreSQL
      try {
        const { stdout } = await execAsync('psql --version');
        const pgVersion = stdout.trim().match(/PostgreSQL (\d+\.\d+)/)?.[1] || '';
        const versionMatch = pgVersion.match(/(\d+)\.(\d+)/);
        if (versionMatch) {
          const majorVersion = parseInt(versionMatch[1]);
          const passed = majorVersion >= 14;
          checks.push({
            name: 'postgresql',
            label: 'PostgreSQL',
            passed,
            current: pgVersion ? `v${pgVersion}` : '',
            required: '>= 14.0'
          });
        } else {
          checks.push({
            name: 'postgresql',
            label: 'PostgreSQL',
            passed: false,
            current: '',
            required: '>= 14.0'
          });
        }
      } catch (error) {
        checks.push({
          name: 'postgresql',
          label: 'PostgreSQL',
          passed: false,
          current: '',
          required: '>= 14.0'
        });
      }

      // 检查 Redis
      try {
        const { stdout } = await execAsync('redis-cli --version');
        const redisVersion = stdout.trim().match(/Redis server v=(\d+\.\d+\.\d+)/)?.[1] || '';
        const versionMatch = redisVersion.match(/(\d+)\.(\d+)\.(\d+)/);
        if (versionMatch) {
          const majorVersion = parseInt(versionMatch[1]);
          const passed = majorVersion >= 6;
          checks.push({
            name: 'redis',
            label: 'Redis',
            passed,
            current: redisVersion ? `v${redisVersion}` : '',
            required: '>= 6.0'
          });
        } else {
          checks.push({
            name: 'redis',
            label: 'Redis',
            passed: false,
            current: '',
            required: '>= 6.0'
          });
        }
      } catch (error) {
        checks.push({
          name: 'redis',
          label: 'Redis',
          passed: false,
          current: '',
          required: '>= 6.0'
        });
      }

      return {
        code: 200,
        data: checks,
        message: '环境检测完成'
      };
    }
  },

  // 配置保存 API
  {
    url: '/api/setup/save-config',
    method: 'post',
    response: (req: any) => {
      const config = req.body;

      // 验证必填字段
      if (!config.dbHost || !config.dbPort || !config.dbName || !config.dbUser) {
        return {
          code: 400,
          message: '数据库配置信息不完整'
        };
      }

      // 保存配置到文件
      const success = saveConfigToFile(config);

      if (success) {
        return {
          code: 200,
          message: '配置保存成功'
        };
      } else {
        return {
          code: 500,
          message: '配置保存失败'
        };
      }
    }
  },

  // 配置加载 API
  {
    url: '/api/setup/load-config',
    method: 'get',
    response: () => {
      const config = loadConfigFromFile();
      return {
        code: 200,
        data: config,
        message: '配置加载成功'
      };
    }
  },

  // 配置测试 API
  {
    url: '/api/setup/test-config',
    method: 'post',
    response: async (req: any) => {
      const config = req.body;

      // 验证必填字段
      if (!config.dbHost || !config.dbPort || !config.dbName || !config.dbUser || !config.dbPassword) {
        return {
          code: 400,
          message: '配置信息不完整'
        };
      }

      try {
        // 尝试连接 PostgreSQL 数据库
        const pgPassword = config.dbPassword;
        const connectionString = `postgresql://${config.dbUser}:${pgPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

        // 使用 psql 测试连接
        const { stdout, stderr } = await execAsync(
          `PGPASSWORD="${pgPassword}" psql -h ${config.dbHost} -p ${config.dbPort} -U ${config.dbUser} -d ${config.dbName} -c "SELECT 1"`,
          { timeout: 10000 }
        );

        if (stdout.includes('1')) {
          return {
            code: 200,
            message: '数据库连接测试成功'
          };
        } else {
          return {
            code: 400,
            message: '数据库连接失败'
          };
        }
      } catch (error: any) {
        return {
          code: 400,
          message: `数据库连接失败: ${error.message || '未知错误'}`
        };
      }
    }
  },

  // 服务状态 API
  {
    url: '/api/setup/service-status',
    method: 'get',
    response: async () => {
      const services = [];

      // 检查 agentskills-runtime 状态
      try {
        const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { timeout: 5000 });
        const isRunning = stdout.split('\n').some(line => line.toLowerCase().includes('node.exe'));
        services.push({
          name: 'agentskills-runtime',
          status: isRunning ? 'running' : 'stopped',
          cpu: isRunning ? Math.floor(Math.random() * 20) + 5 : 0,
          memory: isRunning ? Math.floor(Math.random() * 300) + 100 : 0,
          uptime: isRunning ? `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` : ''
        });
      } catch (error) {
        services.push({
          name: 'agentskills-runtime',
          status: 'stopped',
          cpu: 0,
          memory: 0,
          uptime: ''
        });
      }

      // 检查 PostgreSQL 状态
      try {
        const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq postgres.exe" /FO CSV', { timeout: 5000 });
        const isRunning = stdout.split('\n').some(line => line.toLowerCase().includes('postgres.exe'));
        services.push({
          name: 'PostgreSQL',
          status: isRunning ? 'running' : 'stopped',
          cpu: isRunning ? Math.floor(Math.random() * 10) + 1 : 0,
          memory: isRunning ? Math.floor(Math.random() * 200) + 50 : 0,
          uptime: isRunning ? `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` : ''
        });
      } catch (error) {
        services.push({
          name: 'PostgreSQL',
          status: 'stopped',
          cpu: 0,
          memory: 0,
          uptime: ''
        });
      }

      // 检查 Redis 状态
      try {
        const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq redis-server.exe" /FO CSV', { timeout: 5000 });
        const isRunning = stdout.split('\n').some(line => line.toLowerCase().includes('redis-server.exe'));
        services.push({
          name: 'Redis',
          status: isRunning ? 'running' : 'stopped',
          cpu: isRunning ? Math.floor(Math.random() * 5) + 1 : 0,
          memory: isRunning ? Math.floor(Math.random() * 100) + 20 : 0,
          uptime: isRunning ? `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m` : ''
        });
      } catch (error) {
        services.push({
          name: 'Redis',
          status: 'stopped',
          cpu: 0,
          memory: 0,
          uptime: ''
        });
      }

      return {
        code: 200,
        data: services,
        message: '服务状态获取成功'
      };
    }
  },

  // 日志获取 API
  {
    url: '/api/setup/logs',
    method: 'get',
    response: async () => {
      // 尝试从多个位置读取日志文件
      const logPaths = [
        path.join(process.cwd(), 'logs', 'app.log'),
        path.join(process.cwd(), 'logs', 'runtime.log'),
        path.join(process.cwd(), 'logs', 'error.log'),
        path.join(process.cwd(), 'logs', 'combined.log'),
        path.join(process.cwd(), 'server.log'),
      ];

      let logs: any[] = [];

      for (const logPath of logPaths) {
        try {
          if (fs.existsSync(logPath)) {
            const content = fs.readFileSync(logPath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());

            // 解析日志行
            for (const line of lines) {
              // 尝试匹配常见的日志格式
              // 格式1: [2026-03-30 10:00:00] [INFO] message
              let match = line.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s*\[(\w+)\]\s*(.+)/);
              if (match) {
                logs.push({
                  id: logs.length + 1,
                  time: match[1],
                  level: match[2].toLowerCase(),
                  message: match[3]
                });
                continue;
              }

              // 格式2: 2026-03-30 10:00:00 INFO message
              match = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+(\w+)\s+(.+)/);
              if (match) {
                logs.push({
                  id: logs.length + 1,
                  time: match[1],
                  level: match[2].toLowerCase(),
                  message: match[3]
                });
                continue;
              }

              // 格式3: [INFO] message
              match = line.match(/\[(\w+)\]\s*(.+)/);
              if (match) {
                logs.push({
                  id: logs.length + 1,
                  time: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  level: match[1].toLowerCase(),
                  message: match[2]
                });
                continue;
              }

              // 默认格式: 直接作为消息
              logs.push({
                id: logs.length + 1,
                time: new Date().toISOString().replace('T', ' ').substring(0, 19),
                level: 'info',
                message: line
              });
            }
          }
        } catch (error) {
          console.error(`读取日志文件 ${logPath} 失败:`, error);
        }
      }

      // 如果没有找到日志文件，返回一些默认日志
      if (logs.length === 0) {
        logs = [
          {
            id: 1,
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            level: 'info',
            message: '系统初始化中...'
          },
          {
            id: 2,
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            level: 'warn',
            message: '未找到日志文件，使用默认日志'
          }
        ];
      }

      // 只返回最近的100条日志
      logs = logs.slice(-100);

      return {
        code: 200,
        data: logs,
        message: '日志获取成功'
      };
    }
  },

  // 管理员账号创建 API
  {
    url: '/api/setup/create-admin',
    method: 'post',
    response: (req: any) => {
      const { email, password, name, role } = req.body;
      
      // 验证必填字段
      if (!email || !password) {
        return {
          code: 400,
          message: '邮箱和密码为必填项'
        };
      }
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          code: 400,
          message: '邮箱格式不正确'
        };
      }
      
      // 验证密码强度
      if (password.length < 8) {
        return {
          code: 400,
          message: '密码长度至少为 8 位'
        };
      }
      
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*]/.test(password);
      
      if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        return {
          code: 400,
          message: '密码必须包含大小写字母、数字和特殊字符'
        };
      }
      
      // 模拟创建管理员账号
      console.log('创建管理员账号:', { email, name, role });
      
      return {
        code: 200,
        data: {
          id: 'admin-' + Date.now(),
          email,
          name: name || '管理员',
          role: role || 'admin',
          createdAt: new Date().toISOString()
        },
        message: '管理员账号创建成功'
      };
    }
  },

  // 启动服务 API
  {
    url: '/api/setup/start-runtime',
    method: 'post',
    response: async () => {
      try {
        // 尝试启动 agentskills-runtime
        // 这里假设启动脚本是 start-runtime.bat 或 start-runtime.sh
        const startScript = process.platform === 'win32' ? 'start-runtime.bat' : 'start-runtime.sh';
        const startScriptPath = path.join(process.cwd(), startScript);

        if (fs.existsSync(startScriptPath)) {
          // 使用 spawn 启动服务（不阻塞当前进程）
          const { spawn } = require('child_process');
          spawn(startScriptPath, [], {
            detached: true,
            stdio: 'ignore',
            shell: true
          });

          return {
            code: 200,
            message: 'agentskills-runtime 启动命令已执行'
          };
        } else {
          // 如果没有启动脚本，尝试使用 npm/yarn/pnpm
          try {
            const { spawn } = require('child_process');
            const packageManager = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))
              ? 'pnpm'
              : fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
                ? 'yarn'
                : 'npm';

            const command = packageManager === 'npm' ? 'start' : `${packageManager} start`;
            spawn(command, [], {
              cwd: process.cwd(),
              detached: true,
              stdio: 'ignore',
              shell: true
            });

            return {
              code: 200,
              message: `agentskills-runtime 启动命令已执行 (${packageManager})`
            };
          } catch (error) {
            return {
              code: 500,
              message: '启动失败: 未找到启动脚本或包管理器'
            };
          }
        }
      } catch (error: any) {
        return {
          code: 500,
          message: `启动失败: ${error.message || '未知错误'}`
        };
      }
    }
  },

  // 停止服务 API
  {
    url: '/api/setup/stop-runtime',
    method: 'post',
    response: async () => {
      try {
        // 尝试停止 Node.js 进程（agentskills-runtime）
        const { stdout } = await execAsync('taskkill /F /IM node.exe', { timeout: 10000 });

        return {
          code: 200,
          message: 'agentskills-runtime 停止命令已执行'
        };
      } catch (error: any) {
        // 如果没有找到进程，也视为成功
        if (error.message && error.message.includes('not found')) {
          return {
            code: 200,
            message: 'agentskills-runtime 未在运行'
          };
        }
        return {
          code: 500,
          message: `停止失败: ${error.message || '未知错误'}`
        };
      }
    }
  },

  // 重启服务 API
  {
    url: '/api/setup/restart-runtime',
    method: 'post',
    response: async () => {
      try {
        // 先停止服务
        try {
          await execAsync('taskkill /F /IM node.exe', { timeout: 10000 });
        } catch (error) {
          // 忽略停止失败，继续启动
        }

        // 等待一小段时间确保进程完全停止
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 再启动服务
        const startScript = process.platform === 'win32' ? 'start-runtime.bat' : 'start-runtime.sh';
        const startScriptPath = path.join(process.cwd(), startScript);

        if (fs.existsSync(startScriptPath)) {
          const { spawn } = require('child_process');
          spawn(startScriptPath, [], {
            detached: true,
            stdio: 'ignore',
            shell: true
          });

          return {
            code: 200,
            message: 'agentskills-runtime 重启命令已执行'
          };
        } else {
          // 使用包管理器启动
          const { spawn } = require('child_process');
          const packageManager = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))
            ? 'pnpm'
            : fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
              ? 'yarn'
              : 'npm';

          const command = packageManager === 'npm' ? 'start' : `${packageManager} start`;
          spawn(command, [], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'ignore',
            shell: true
          });

          return {
            code: 200,
            message: `agentskills-runtime 重启命令已执行 (${packageManager})`
          };
        }
      } catch (error: any) {
        return {
          code: 500,
          message: `重启失败: ${error.message || '未知错误'}`
        };
      }
    }
  }
] as MockMethod[];
