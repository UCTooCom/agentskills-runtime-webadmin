import { Controller, Get, Post, Body } from '@nestjs/common';
import { Public } from '../public/public.decorator';
import { SetupService } from './setup.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Setup')
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Public()
  @Get('check-environment')
  @ApiOperation({ summary: '检查环境配置' })
  @ApiResponse({ status: 200, description: '环境检查成功' })
  async checkEnvironment() {
    return this.setupService.checkEnvironment();
  }

  @Public()
  @Post('save-config')
  @ApiOperation({ summary: '保存配置' })
  @ApiResponse({ status: 200, description: '配置保存成功' })
  async saveConfig(@Body() config: any) {
    return this.setupService.saveConfig(config);
  }

  @Public()
  @Get('load-config')
  @ApiOperation({ summary: '加载配置' })
  @ApiResponse({ status: 200, description: '配置加载成功' })
  async loadConfig() {
    return this.setupService.loadConfig();
  }

  @Public()
  @Post('test-config')
  @ApiOperation({ summary: '测试配置' })
  @ApiResponse({ status: 200, description: '配置测试成功' })
  async testConfig(@Body() config: any) {
    return this.setupService.testConfig(config);
  }

  @Public()
  @Get('service-status')
  @ApiOperation({ summary: '获取服务状态' })
  @ApiResponse({ status: 200, description: '服务状态获取成功' })
  async getServiceStatus() {
    return this.setupService.getServiceStatus();
  }

  @Public()
  @Get('logs')
  @ApiOperation({ summary: '获取日志' })
  @ApiResponse({ status: 200, description: '日志获取成功' })
  async getLogs() {
    return this.setupService.getLogs();
  }

  @Public()
  @Post('create-admin')
  @ApiOperation({ summary: '创建管理员账号' })
  @ApiResponse({ status: 200, description: '管理员账号创建成功' })
  async createAdmin(@Body() adminData: any) {
    return this.setupService.createAdminAccount(adminData);
  }

  @Public()
  @Post('start-runtime')
  @ApiOperation({ summary: '启动 Runtime 服务' })
  @ApiResponse({ status: 200, description: '服务启动成功' })
  async startRuntime() {
    return this.setupService.startRuntime();
  }

  @Public()
  @Post('stop-runtime')
  @ApiOperation({ summary: '停止 Runtime 服务' })
  @ApiResponse({ status: 200, description: '服务停止成功' })
  async stopRuntime() {
    return this.setupService.stopRuntime();
  }

  @Public()
  @Post('restart-runtime')
  @ApiOperation({ summary: '重启 Runtime 服务' })
  @ApiResponse({ status: 200, description: '服务重启成功' })
  async restartRuntime() {
    return this.setupService.restartRuntime();
  }

  @Public()
  @Get('check-runtime')
  @ApiOperation({ summary: '检查 Runtime 是否已安装' })
  @ApiResponse({ status: 200, description: 'Runtime 检查成功' })
  async checkRuntime() {
    return this.setupService.checkRuntime();
  }

  @Public()
  @Post('install-runtime')
  @ApiOperation({ summary: '安装 Runtime' })
  @ApiResponse({ status: 200, description: 'Runtime 安装成功' })
  async installRuntime(@Body() options?: any) {
    return this.setupService.installRuntime(options);
  }

  @Public()
  @Get('read-runtime-env')
  @ApiOperation({ summary: '读取 Runtime .env 配置文件' })
  @ApiResponse({ status: 200, description: '配置文件读取成功' })
  async readRuntimeEnv() {
    return this.setupService.readRuntimeEnv();
  }

  @Public()
  @Post('save-runtime-env')
  @ApiOperation({ summary: '保存 Runtime .env 配置文件' })
  @ApiResponse({ status: 200, description: '配置文件保存成功' })
  async saveRuntimeEnv(@Body() config: any) {
    return this.setupService.saveRuntimeEnv(config);
  }

  @Public()
  @Post('generate-ssl')
  @ApiOperation({ summary: '生成自签名 SSL 证书' })
  @ApiResponse({ status: 200, description: '证书生成成功' })
  async generateSSL(@Body() options: any) {
    return this.setupService.generateSSL(options);
  }

  @Public()
  @Post('save-ssl')
  @ApiOperation({ summary: '保存自定义 SSL 证书' })
  @ApiResponse({ status: 200, description: '证书保存成功' })
  async saveSSL(@Body() sslData: any) {
    return this.setupService.saveSSL(sslData);
  }

  @Public()
  @Post('create-admin')
  @ApiOperation({ summary: '创建管理员账号' })
  @ApiResponse({ status: 200, description: '管理员账号创建成功' })
  async createAdminAccount(@Body() adminData: any) {
    return this.setupService.createAdminAccount(adminData);
  }
}
