/*
 Navicat Premium Dump SQL

 Source Server         : localmysql
 Source Server Type    : MySQL
 Source Server Version : 100415 (10.4.15-MariaDB-log)
 Source Host           : localhost:3306
 Source Schema         : tinypro

 Target Server Type    : MySQL
 Target Server Version : 100415 (10.4.15-MariaDB-log)
 File Encoding         : 65001

 Date: 28/03/2026 06:42:15
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for application
-- ----------------------------
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `classify` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of application
-- ----------------------------
INSERT INTO `application` VALUES (1, 'Tiny Design 设计体系', '华为云产品和服务的规范体系，包括交互视觉设计、业务流程、国际化、术语词条。', 'card-list-application-default.png', '[{ \"type\": \"\", \"value\": \"机会点定义\" }, { \"type\": \"danger\", \"value\": \"交互设计\" }]', 'design');
INSERT INTO `application` VALUES (2, 'Tiny DesignLink 设计流水线工具', '设计+协同+资源管理，一个工具就够了，在线原型设计、设计过程融入DevOps流程。', 'card-list-application-default.png', '[{ \"type\": \"error\", \"value\": \"交互设计\" }, { \"type\": \"warning\", \"value\": \"视觉设计\" }]', 'design');
INSERT INTO `application` VALUES (3, 'TinyUI3.0 开发工具 ', 'Cloud Design System 提供了丰富的规范文档及开发组件。', 'card-list-application-default.png', '[{ \"type\": \"success\", \"value\": \"开发\" }]', 'dev');
INSERT INTO `application` VALUES (4, 'TinyPlus3.0 开发工具', 'TinyPlus3.0 是基于Angular + Typescript的Web前端云业务组件库。', 'card-list-tiny-plus.png', '[{ \"type\": \"success\", \"value\": \"开发\" }]', 'dev');
INSERT INTO `application` VALUES (5, 'Tiny Stage 工程工具 ', '一个跨平台的前端工程化cli工具，为开发提供一系列开发套件和工程插件', 'card-list-console-framework.png', '[{ \"type\": \"success\", \"value\": \"开发\" }]', 'dev');
INSERT INTO `application` VALUES (6, 'Tiny Flow 接口编排工具 ', '端到端的API编排解决方案，通过可视化编程的方式快速生成、发布、调试的API编排。', 'card-list-console-framework.png', '[{ \"type\": \"success\", \"value\": \"开发\" }]', 'dev');
INSERT INTO `application` VALUES (7, 'Tiny Gate 门禁系统', '门禁系统，通过卡点方式集成到伏羲流水线，在服务发布时生成预览页面。', 'card-list-console-framework.png', '[{ \"type\": \"info\", \"value\": \"测试验证\" }]', 'dev');
INSERT INTO `application` VALUES (8, 'Console Framework 控制台框架', '华为云各服务快速构建管理控制台的平台。', 'card-list-console-framework.png', '[{ \"type\": \"success\", \"value\": \"开发\" },{ \"type\": \"info\", \"value\": \"测试验证\" },{ \"type\": \"warning\", \"value\": \"上线\" }]', 'dev');
INSERT INTO `application` VALUES (9, 'Nodejs Framework Nodejs应用', '基于egg的定制化web服务框架，让你快速上手Nodejs做BFF意见微服务。', 'card-list-console-framework.png', '[{ \"type\": \"success\", \"value\": \"开发\" },{ \"type\": \"info\", \"value\": \"测试验证\" }]', 'dev');
INSERT INTO `application` VALUES (10, 'Furion 前端体验监控', '提供端到端前端用户体验度量，让产品用户体验可度量、可监控、可优化。', 'card-list-furion.png', '[{ \"type\": \"\", \"value\": \"机会点定义\" }]', 'dev');
INSERT INTO `application` VALUES (11, 'Tiny Mock API 管理', '功能强大的API管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。', 'card-list-application-default.png', '[{ \"type\": \"success\", \"value\": \"开发\" },{ \"type\": \"warning\", \"value\": \"视觉设计\" }]', 'dev');

-- ----------------------------
-- Table structure for i18
-- ----------------------------
DROP TABLE IF EXISTS `i18`;
CREATE TABLE `i18`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `langId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_ee6c070b91e32eae04e541e5844`(`langId` ASC) USING BTREE,
  CONSTRAINT `FK_ee6c070b91e32eae04e541e5844` FOREIGN KEY (`langId`) REFERENCES `lang` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1153 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of i18
-- ----------------------------
INSERT INTO `i18` VALUES (1, 'en-US', 'English', 1);
INSERT INTO `i18` VALUES (2, 'zh-CN', '中文', 1);
INSERT INTO `i18` VALUES (3, 'zh-TW', '中国台湾', 1);
INSERT INTO `i18` VALUES (4, 'hello', 'Hello {name}', 1);
INSERT INTO `i18` VALUES (5, 'code', 'en-US', 1);
INSERT INTO `i18` VALUES (6, 'yes', 'Yes', 1);
INSERT INTO `i18` VALUES (7, 'no', 'No', 1);
INSERT INTO `i18` VALUES (8, 'menu.board', 'Dashboard Page', 1);
INSERT INTO `i18` VALUES (9, 'menu.home', 'Monitoring page', 1);
INSERT INTO `i18` VALUES (10, 'menu.work', 'workbench', 1);
INSERT INTO `i18` VALUES (11, 'menu.list', 'List', 1);
INSERT INTO `i18` VALUES (12, 'menu.result', 'Result', 1);
INSERT INTO `i18` VALUES (13, 'menu.exception', 'Exception', 1);
INSERT INTO `i18` VALUES (14, 'menu.form', 'Form', 1);
INSERT INTO `i18` VALUES (15, 'menu.profile', 'Profile', 1);
INSERT INTO `i18` VALUES (16, 'menu.profile.detail', 'Basic details page', 1);
INSERT INTO `i18` VALUES (17, 'menu.visualization', 'Data Visualization', 1);
INSERT INTO `i18` VALUES (18, 'menu.menuPage', 'Menu Page', 1);
INSERT INTO `i18` VALUES (19, 'menu.menuPage.second', 'Second Page', 1);
INSERT INTO `i18` VALUES (20, 'menu.menuPage.third', 'Menu Demo Page', 1);
INSERT INTO `i18` VALUES (21, 'menu.user', 'User Center', 1);
INSERT INTO `i18` VALUES (22, 'menu.systemManager', 'System Manager', 1);
INSERT INTO `i18` VALUES (23, 'menu.userManager', 'User Manager', 1);
INSERT INTO `i18` VALUES (24, 'menu.userManager.info', 'All User Info', 1);
INSERT INTO `i18` VALUES (25, 'menu.userManager.setting', 'All User Setting', 1);
INSERT INTO `i18` VALUES (26, 'menu.userManager.useradd', 'Add User', 1);
INSERT INTO `i18` VALUES (27, 'menu.permission', 'Permission Manager', 1);
INSERT INTO `i18` VALUES (28, 'menu.permission.info', 'All Permission Info', 1);
INSERT INTO `i18` VALUES (29, 'menu.permission.setting', 'Permission Setting', 1);
INSERT INTO `i18` VALUES (30, 'menu.permission.permissionAdd', 'Add Permission', 1);
INSERT INTO `i18` VALUES (31, 'menu.role', 'Role Manager', 1);
INSERT INTO `i18` VALUES (32, 'menu.role.info', 'All Role Info', 1);
INSERT INTO `i18` VALUES (33, 'menu.menu', 'Menu Manager', 1);
INSERT INTO `i18` VALUES (34, 'menu.menu.info', 'All Menu Info', 1);
INSERT INTO `i18` VALUES (35, 'navbar.docs', 'Docs', 1);
INSERT INTO `i18` VALUES (36, 'navbar.action.locale', 'Switch to English', 1);
INSERT INTO `i18` VALUES (37, 'messageBox.switchRoles', 'Switch Roles', 1);
INSERT INTO `i18` VALUES (38, 'messageBox.userCenter', 'User Center', 1);
INSERT INTO `i18` VALUES (39, 'messageBox.userSettings', 'User Settings', 1);
INSERT INTO `i18` VALUES (40, 'messageBox.logout', 'Logout', 1);
INSERT INTO `i18` VALUES (41, 'messageBox.updatePwd', 'Update Password', 1);
INSERT INTO `i18` VALUES (42, 'message.delete.success', 'Delete Success', 1);
INSERT INTO `i18` VALUES (43, 'menu.cloud', 'Cloud service capability', 1);
INSERT INTO `i18` VALUES (44, 'menu.btn.confirm', 'Submit', 1);
INSERT INTO `i18` VALUES (45, 'menu.i18n', 'I18n Manage', 1);
INSERT INTO `i18` VALUES (46, 'theme.title.main', 'Personalized configuration', 1);
INSERT INTO `i18` VALUES (47, 'theme.title.first', 'theme', 1);
INSERT INTO `i18` VALUES (48, 'theme.title.default', 'Default Theme', 1);
INSERT INTO `i18` VALUES (49, 'theme.title.honey', 'Honey Theme', 1);
INSERT INTO `i18` VALUES (50, 'theme.title.violet', 'Violet Theme', 1);
INSERT INTO `i18` VALUES (51, 'theme.title.deepness', 'Deep Night Sky Theme', 1);
INSERT INTO `i18` VALUES (52, 'theme.title.deep', 'Dark Theme', 1);
INSERT INTO `i18` VALUES (53, 'theme.title.light', 'Light Theme', 1);
INSERT INTO `i18` VALUES (54, 'theme.title.customization', 'Custom Themes', 1);
INSERT INTO `i18` VALUES (55, 'theme-title-recommend', 'Recommended Topics', 1);
INSERT INTO `i18` VALUES (56, 'theme-text-default', 'Science and technology, exploration, research, precision, tolerance', 1);
INSERT INTO `i18` VALUES (57, 'theme-text-honey', 'Bright, sensual, warm, positive, energetic', 1);
INSERT INTO `i18` VALUES (58, 'theme-text-violet', 'Elegant, romantic, gentle, mysterious, noble', 1);
INSERT INTO `i18` VALUES (59, 'theme-text-deepness', 'Smooth, Neutral, Space, Strength, Hard', 1);
INSERT INTO `i18` VALUES (60, 'theme-text-dark', 'Deep, decisive, brave, tenacious, yearning', 1);
INSERT INTO `i18` VALUES (61, 'settings.title', 'Settings', 1);
INSERT INTO `i18` VALUES (62, 'settings.themeColor', 'Theme Color', 1);
INSERT INTO `i18` VALUES (63, 'settings.content', 'Content Setting', 1);
INSERT INTO `i18` VALUES (64, 'settings.search', 'Search', 1);
INSERT INTO `i18` VALUES (65, 'settings.language', 'Language', 1);
INSERT INTO `i18` VALUES (66, 'settings.navbar', 'simple mode', 1);
INSERT INTO `i18` VALUES (67, 'settings.menuWidth', 'Menu Width (px)', 1);
INSERT INTO `i18` VALUES (68, 'settings.navbar.alerts', 'alerts', 1);
INSERT INTO `i18` VALUES (69, 'settings.navbar.help', 'Help Center', 1);
INSERT INTO `i18` VALUES (70, 'settings.menu', 'classic mode', 1);
INSERT INTO `i18` VALUES (71, 'settings.tabBar', 'Tab Bar', 1);
INSERT INTO `i18` VALUES (72, 'settings.footer', 'fashion mode', 1);
INSERT INTO `i18` VALUES (73, 'settings.colorWeek', 'Theme Configuration', 1);
INSERT INTO `i18` VALUES (74, 'settings.alertContent', 'After the configuration is only temporarily effective, if you want to really affect the project, click the \"Copy Settings\" button below and replace the configuration in settings.json.', 1);
INSERT INTO `i18` VALUES (75, 'settings.copySettings', 'Copy Settings', 1);
INSERT INTO `i18` VALUES (76, 'settings.copySettings.message', 'Copy succeeded, please paste to file src/settings.json.', 1);
INSERT INTO `i18` VALUES (77, 'settings.close', 'Close', 1);
INSERT INTO `i18` VALUES (78, 'settings.color.tooltip', '10 gradient colors generated according to the theme color', 1);
INSERT INTO `i18` VALUES (79, 'setting.user.set', 'User Settings', 1);
INSERT INTO `i18` VALUES (80, 'setting.loginout', 'Logout succeeded', 1);
INSERT INTO `i18` VALUES (81, 'setting.copy', 'Copying succeeded', 1);
INSERT INTO `i18` VALUES (82, 'setting.input.search', 'Enter a keyword', 1);
INSERT INTO `i18` VALUES (83, 'setting.foot.title', 'Produced by OpenCangjie', 1);
INSERT INTO `i18` VALUES (84, 'setting.mode.navbar', 'Collapse Header, Footer', 1);
INSERT INTO `i18` VALUES (85, 'setting.mode.menu', 'Collapse menu', 1);
INSERT INTO `i18` VALUES (86, 'setting.mode.footer', 'Collapse Footer', 1);
INSERT INTO `i18` VALUES (87, 'login.form.mode', 'Account and password login', 1);
INSERT INTO `i18` VALUES (88, 'login.form.mail', 'Email login', 1);
INSERT INTO `i18` VALUES (89, 'login.form.title', 'Login to Tiny Pro', 1);
INSERT INTO `i18` VALUES (90, 'login.form.userName.errMsg', 'Username cannot be empty', 1);
INSERT INTO `i18` VALUES (91, 'login.form.password.errMsg', 'Password cannot be empty', 1);
INSERT INTO `i18` VALUES (92, 'login.form.mailName.errMsg', 'The mailbox name cannot be empty', 1);
INSERT INTO `i18` VALUES (93, 'login.form.mailpassword.errMsg', 'The email password cannot be empty', 1);
INSERT INTO `i18` VALUES (94, 'login.form.mailpassword2.errMsg', 'Confirm password cannot be empty', 1);
INSERT INTO `i18` VALUES (95, 'login.form.login.errMsg', 'Login error, refresh and try again', 1);
INSERT INTO `i18` VALUES (96, 'login.form.login.success', 'welcome to use', 1);
INSERT INTO `i18` VALUES (97, 'login.form.userName.placeholder', 'Username: admin', 1);
INSERT INTO `i18` VALUES (98, 'login.form.password.placeholder', 'Password: admin', 1);
INSERT INTO `i18` VALUES (99, 'login.form.mailName.placeholder', 'EmailName：123{\'@\'}example.com', 1);
INSERT INTO `i18` VALUES (100, 'login.form.mailpassword.placeholder', 'Password：admin', 1);
INSERT INTO `i18` VALUES (101, 'login.form.registerMail.placeholder', 'Register Email：', 1);
INSERT INTO `i18` VALUES (102, 'login.form.registerPassword.placeholder', 'Registration password：', 1);
INSERT INTO `i18` VALUES (103, 'login.form.registerConfirmPassword.placeholder', 'Confirm Password：', 1);
INSERT INTO `i18` VALUES (104, 'login.form.rememberPassword', 'Remember password', 1);
INSERT INTO `i18` VALUES (105, 'login.form.forgetPassword', 'Forgot password', 1);
INSERT INTO `i18` VALUES (106, 'login.form.registration', 'Sign up', 1);
INSERT INTO `i18` VALUES (107, 'login.form.login', 'login', 1);
INSERT INTO `i18` VALUES (108, 'login.form.register', 'register', 1);
INSERT INTO `i18` VALUES (109, 'login.form.registerPass', 'The verification is successful and the registration is successful', 1);
INSERT INTO `i18` VALUES (110, 'login.form.registerError', 'Verification failed!', 1);
INSERT INTO `i18` VALUES (111, 'login.form.change', 'Sign in with', 1);
INSERT INTO `i18` VALUES (112, 'login.form.mailInput', 'Email:', 1);
INSERT INTO `i18` VALUES (113, 'login.form.passwordInput', 'Password:', 1);
INSERT INTO `i18` VALUES (114, 'login.form.passwordConfirm', 'Confirm Password:', 1);
INSERT INTO `i18` VALUES (115, 'login.form.checkUsername', 'Letters, numbers, underscores, dashes, dots{\'@\'}Letters, numbers, dashes', 1);
INSERT INTO `i18` VALUES (116, 'login.form.checkPassword', 'At least eight characters, including at least one uppercase letter, one lowercase letter, and one digit', 1);
INSERT INTO `i18` VALUES (117, 'login.form.confirmPassword', 'Inconsistent passwords', 1);
INSERT INTO `i18` VALUES (118, 'login.banner.slogan1', 'Out-of-the-box high-quality template', 1);
INSERT INTO `i18` VALUES (119, 'login.banner.subSlogan1', 'Rich page templates, covering most typical business scenarios', 1);
INSERT INTO `i18` VALUES (120, 'login.banner.slogan2', 'Built-in solutions to common problems', 1);
INSERT INTO `i18` VALUES (121, 'login.banner.subSlogan2', 'Internationalization, routing configuration, state management everything', 1);
INSERT INTO `i18` VALUES (122, 'login.banner.slogan3', 'Access visualization enhancement tool AUX', 1);
INSERT INTO `i18` VALUES (123, 'login.banner.subSlogan3', 'Realize flexible block development', 1);
INSERT INTO `i18` VALUES (124, 'login.icon.language', 'language', 1);
INSERT INTO `i18` VALUES (125, 'login.tip.info', 'User name: admin; password: admin', 1);
INSERT INTO `i18` VALUES (126, 'login.tip.mail', 'User name: admin{\'@\'}example.com; password: admin', 1);
INSERT INTO `i18` VALUES (127, 'login.tip.right', 'Enter the correct user name and password', 1);
INSERT INTO `i18` VALUES (128, 'login.main.text', 'AgentSkills Mid-Back-End Front-End Solution', 1);
INSERT INTO `i18` VALUES (129, 'menu.list.searchTable', 'Search Table', 1);
INSERT INTO `i18` VALUES (130, 'searchTable.form.number', 'Set Number', 1);
INSERT INTO `i18` VALUES (131, 'searchTable.form.placeholder', 'Please select attributes or enter keywords to search', 1);
INSERT INTO `i18` VALUES (132, 'searchTable.form.number.placeholder', 'Please enter Set Number', 1);
INSERT INTO `i18` VALUES (133, 'searchTable.form.name', 'Set Name', 1);
INSERT INTO `i18` VALUES (134, 'searchTable.form.name.placeholder', 'Please enter Set Name', 1);
INSERT INTO `i18` VALUES (135, 'searchTable.form.contentType', 'Content Type', 1);
INSERT INTO `i18` VALUES (136, 'searchTable.form.contentType.img', 'image-text', 1);
INSERT INTO `i18` VALUES (137, 'searchTable.form.contentType.horizontalVideo', 'Horizontal short video', 1);
INSERT INTO `i18` VALUES (138, 'searchTable.form.contentType.verticalVideo', 'Vertical short video', 1);
INSERT INTO `i18` VALUES (139, 'searchTable.form.filterType', 'Filter Type', 1);
INSERT INTO `i18` VALUES (140, 'searchTable.form.filterType.artificial', 'artificial', 1);
INSERT INTO `i18` VALUES (141, 'searchTable.form.filterType.rules', 'Rules', 1);
INSERT INTO `i18` VALUES (142, 'searchTable.form.createdTime', 'Create Date', 1);
INSERT INTO `i18` VALUES (143, 'searchTable.form.status', 'Status', 1);
INSERT INTO `i18` VALUES (144, 'searchTable.form.status.online', 'Online', 1);
INSERT INTO `i18` VALUES (145, 'searchTable.form.status.offline', 'Offline', 1);
INSERT INTO `i18` VALUES (146, 'searchTable.form.status.doing', 'Ongoing', 1);
INSERT INTO `i18` VALUES (147, 'searchTable.form.search', 'Search', 1);
INSERT INTO `i18` VALUES (148, 'searchTable.form.reset', 'Reset', 1);
INSERT INTO `i18` VALUES (149, 'searchTable.form.selectDefault', 'All', 1);
INSERT INTO `i18` VALUES (150, 'searchTable.operation.create', 'Create', 1);
INSERT INTO `i18` VALUES (151, 'searchTable.operation.import', 'Export', 1);
INSERT INTO `i18` VALUES (152, 'searchTable.operation.download', 'Download', 1);
INSERT INTO `i18` VALUES (153, 'searchTable.form.collapse', 'Collapse', 1);
INSERT INTO `i18` VALUES (154, 'searchTable.form.extend', 'Extend', 1);
INSERT INTO `i18` VALUES (155, 'searchTable.form.input', 'Please enter', 1);
INSERT INTO `i18` VALUES (156, 'searchTable.form.create', 'Creating a Topic', 1);
INSERT INTO `i18` VALUES (157, 'searchTable.columns.employeeNo', 'ID', 1);
INSERT INTO `i18` VALUES (158, 'searchTable.columns.name', 'Set Name', 1);
INSERT INTO `i18` VALUES (159, 'searchTable.columns.department', 'Department', 1);
INSERT INTO `i18` VALUES (160, 'searchTable.columns.departmentLevel', 'Department Level', 1);
INSERT INTO `i18` VALUES (161, 'searchTable.columns.count', 'Count', 1);
INSERT INTO `i18` VALUES (162, 'searchTable.columns.workbenchName', 'Workbench', 1);
INSERT INTO `i18` VALUES (163, 'searchTable.columns.project', 'Enablement', 1);
INSERT INTO `i18` VALUES (164, 'searchTable.columns.type', 'Person Type', 1);
INSERT INTO `i18` VALUES (165, 'searchTable.columns.address', 'Institute', 1);
INSERT INTO `i18` VALUES (166, 'searchTable.columns.roles', 'Role', 1);
INSERT INTO `i18` VALUES (167, 'searchTable.columns.lastUpdateUser', 'Updates Person', 1);
INSERT INTO `i18` VALUES (168, 'searchTable.columns.createTime', 'CreatedTime', 1);
INSERT INTO `i18` VALUES (169, 'searchTable.columns.status', 'Status', 1);
INSERT INTO `i18` VALUES (170, 'searchTable.columns.operations', 'Operations', 1);
INSERT INTO `i18` VALUES (171, 'searchTable.columns.operations.view', 'View', 1);
INSERT INTO `i18` VALUES (172, 'searchTable.columns.operations.delete', 'Delete', 1);
INSERT INTO `i18` VALUES (173, 'searchTable.collapse.restores', 'restores', 1);
INSERT INTO `i18` VALUES (174, 'searchTable.collapse.full', 'Full', 1);
INSERT INTO `i18` VALUES (175, 'menu.list.cardList', 'Card List', 1);
INSERT INTO `i18` VALUES (176, 'cardList.title', 'Service Applications', 1);
INSERT INTO `i18` VALUES (177, 'cardList.options.all', 'All Applications', 1);
INSERT INTO `i18` VALUES (178, 'cardList.options.services', 'Development Services', 1);
INSERT INTO `i18` VALUES (179, 'cardList.options.design', 'Interaction Design', 1);
INSERT INTO `i18` VALUES (180, 'cardList.search.placeholder', 'Enter keywords to search and filter', 1);
INSERT INTO `i18` VALUES (181, 'menu.form.step', 'Step Form', 1);
INSERT INTO `i18` VALUES (182, 'stepForm.button.next', 'Next', 1);
INSERT INTO `i18` VALUES (183, 'stepForm.button.submit', 'Create', 1);
INSERT INTO `i18` VALUES (184, 'stepForm.button.cancel', 'Cancel', 1);
INSERT INTO `i18` VALUES (185, 'stepForm.button.restore', 'Restores', 1);
INSERT INTO `i18` VALUES (186, 'stepForm.probation.day', 'Day', 1);
INSERT INTO `i18` VALUES (187, 'stepForm.coaching.process', 'Coaching Process', 1);
INSERT INTO `i18` VALUES (188, 'stepForm.start.date', 'Labor Contract Start Date', 1);
INSERT INTO `i18` VALUES (189, 'stepForm.end.date', 'Labor Contract End Date', 1);
INSERT INTO `i18` VALUES (190, 'stepForm.probation.period', 'Probation Period', 1);
INSERT INTO `i18` VALUES (191, 'stepForm.probation.start', 'Trial Start and End Date', 1);
INSERT INTO `i18` VALUES (192, 'stepForm.recruitment.type', 'Recruitment Type', 1);
INSERT INTO `i18` VALUES (193, 'stepForm.recruitment.position', 'Position', 1);
INSERT INTO `i18` VALUES (194, 'stepForm.recruitment.department', 'Department', 1);
INSERT INTO `i18` VALUES (195, 'stepForm.start.coaching', 'Start coaching', 1);
INSERT INTO `i18` VALUES (196, 'stepForm.immediate.supervisor', 'Enter the mentor immediate supervisor', 1);
INSERT INTO `i18` VALUES (197, 'stepForm.overall.goals', 'Set overall goals', 1);
INSERT INTO `i18` VALUES (198, 'stepForm.overall.summary', 'Submit the overall summary', 1);
INSERT INTO `i18` VALUES (199, 'stepForm.overall.end', 'End', 1);
INSERT INTO `i18` VALUES (200, 'stepForm.collapse.base', 'Coaching Basic Information', 1);
INSERT INTO `i18` VALUES (201, 'stepForm.collapse.supervisor', 'Entry Supervisor', 1);
INSERT INTO `i18` VALUES (202, 'stepForm.collapse.goals', 'Set overall goals', 1);
INSERT INTO `i18` VALUES (203, 'stepForm.collapse.summary', 'Submit the overall summary', 1);
INSERT INTO `i18` VALUES (204, 'stepForm.coach.position', 'Cultivating Positions', 1);
INSERT INTO `i18` VALUES (205, 'stepForm.coach.culture', 'Training Department', 1);
INSERT INTO `i18` VALUES (206, 'stepForm.coach.mentor', 'Mentor', 1);
INSERT INTO `i18` VALUES (207, 'stepForm.coach.startTime', 'Actual Coaching Start Date', 1);
INSERT INTO `i18` VALUES (208, 'stepForm.coach.endTime', 'Actual Coaching End Date', 1);
INSERT INTO `i18` VALUES (209, 'stepForm.dire.supervisor', 'Mentor Supervisor', 1);
INSERT INTO `i18` VALUES (210, 'stepForm.dire.remarks', 'Mentor Information Remarks', 1);
INSERT INTO `i18` VALUES (211, 'stepForm.dire.startTime', 'Start Coaching Date', 1);
INSERT INTO `i18` VALUES (212, 'stepForm.dire.endTime', 'Coaching End Date', 1);
INSERT INTO `i18` VALUES (213, 'stepForm.target.list', 'Target List', 1);
INSERT INTO `i18` VALUES (214, 'stepForm.target.sure', 'Set goals', 1);
INSERT INTO `i18` VALUES (215, 'stepForm.sum.self', 'Self-summarization', 1);
INSERT INTO `i18` VALUES (216, 'stepForm.error.target', 'At least one item exists on the right', 1);
INSERT INTO `i18` VALUES (217, 'stepForm.head.admin', 'User name', 1);
INSERT INTO `i18` VALUES (218, 'menu.form.base', 'Base Form', 1);
INSERT INTO `i18` VALUES (219, 'baseForm.form.label.no', 'no', 1);
INSERT INTO `i18` VALUES (220, 'baseForm.form.label.yes', 'yes', 1);
INSERT INTO `i18` VALUES (221, 'baseForm.form.label.placeholder', 'Please select', 1);
INSERT INTO `i18` VALUES (222, 'baseForm.form.label.frequencyone', 'By Month', 1);
INSERT INTO `i18` VALUES (223, 'baseForm.form.label.frequencytwo', 'By Week', 1);
INSERT INTO `i18` VALUES (224, 'baseForm.form.label.frequencythree', 'By biweekly', 1);
INSERT INTO `i18` VALUES (225, 'baseForm.form.label.frequencyfour', 'By Quarter', 1);
INSERT INTO `i18` VALUES (226, 'baseForm.form.label.personone', 'Local employees', 1);
INSERT INTO `i18` VALUES (227, 'baseForm.form.label.persontwo', 'Non-Employee', 1);
INSERT INTO `i18` VALUES (228, 'baseForm.form.label.personthree', 'Chinese employees', 1);
INSERT INTO `i18` VALUES (229, 'baseForm.form.label.projectone', 'Training for new employees of the manufacturing department', 1);
INSERT INTO `i18` VALUES (230, 'baseForm.form.label.projecttwo', 'On-boarding coaching for new employees', 1);
INSERT INTO `i18` VALUES (231, 'baseForm.form.label.projectthree', 'UI Automation Test Coaching Project', 1);
INSERT INTO `i18` VALUES (232, 'baseForm.form.label.people', 'Applicable Populations', 1);
INSERT INTO `i18` VALUES (233, 'baseForm.form.label.rank', 'Job Level', 1);
INSERT INTO `i18` VALUES (234, 'baseForm.form.label.type', 'Project Type', 1);
INSERT INTO `i18` VALUES (235, 'baseForm.form.label.business', 'Service attribute', 1);
INSERT INTO `i18` VALUES (236, 'baseForm.form.label.Objectives', 'Overall objective', 1);
INSERT INTO `i18` VALUES (237, 'baseForm.form.label.culture', 'Training Department', 1);
INSERT INTO `i18` VALUES (238, 'baseForm.form.label.develop', 'develop', 1);
INSERT INTO `i18` VALUES (239, 'baseForm.form.label.developone', 'Trainees', 1);
INSERT INTO `i18` VALUES (240, 'baseForm.form.label.developtwo', 'Mentor', 1);
INSERT INTO `i18` VALUES (241, 'baseForm.form.label.effective', 'Effective Condition', 1);
INSERT INTO `i18` VALUES (242, 'baseForm.form.label.effectiveone', 'Effective without approval', 1);
INSERT INTO `i18` VALUES (243, 'baseForm.form.label.effectivetwo', 'Mentor Approval', 1);
INSERT INTO `i18` VALUES (244, 'baseForm.form.label.effectivethree', 'Immediate supervisor approval', 1);
INSERT INTO `i18` VALUES (245, 'baseForm.form.label.effectivefour', 'Mentors and immediate supervisors approve the application', 1);
INSERT INTO `i18` VALUES (246, 'baseForm.form.label.plan', 'Phase Plan', 1);
INSERT INTO `i18` VALUES (247, 'baseForm.form.label.confirm', 'Whether to develop', 1);
INSERT INTO `i18` VALUES (248, 'baseForm.form.label.frequency', 'Formulation frequency', 1);
INSERT INTO `i18` VALUES (249, 'baseForm.form.label.role', 'Goal Setting Role', 1);
INSERT INTO `i18` VALUES (250, 'baseForm.form.label.roleone', 'Trainees', 1);
INSERT INTO `i18` VALUES (251, 'baseForm.form.label.roletwo', 'Mentor', 1);
INSERT INTO `i18` VALUES (252, 'baseForm.form.label.condition', 'Target Effective Condition', 1);
INSERT INTO `i18` VALUES (253, 'baseForm.form.label.conditionone', 'Effective without approval', 1);
INSERT INTO `i18` VALUES (254, 'baseForm.form.label.conditiontwo', 'Mentor Approval', 1);
INSERT INTO `i18` VALUES (255, 'baseForm.form.label.conditionthree', 'Immediate supervisor approval', 1);
INSERT INTO `i18` VALUES (256, 'baseForm.form.label.conditionfour', 'Mentors and immediate supervisors approve the application', 1);
INSERT INTO `i18` VALUES (257, 'baseForm.form.label.staged', 'Phase Evaluation', 1);
INSERT INTO `i18` VALUES (258, 'baseForm.form.label.stagedone', 'Only mentor evaluation is required', 1);
INSERT INTO `i18` VALUES (259, 'baseForm.form.label.stagedtwo', 'Only immediate supervisor evaluation is required', 1);
INSERT INTO `i18` VALUES (260, 'baseForm.form.label.stagedthree', 'Need to be evaluated by the mentor and immediate supervisor', 1);
INSERT INTO `i18` VALUES (261, 'baseForm.form.label.wholeconfirm', 'Whether to develop', 1);
INSERT INTO `i18` VALUES (262, 'baseForm.form.label.evaluation', 'Overall evaluation', 1);
INSERT INTO `i18` VALUES (263, 'baseForm.form.label.evaluationyes', 'Mentors and immediate supervisors are required for evaluation', 1);
INSERT INTO `i18` VALUES (264, 'baseForm.form.label.evaluationno', 'No mentor is required, and the immediate supervisor evaluates it', 1);
INSERT INTO `i18` VALUES (265, 'baseForm.form.label.mentortitle', 'Mentor Selection', 1);
INSERT INTO `i18` VALUES (266, 'baseForm.form.label.mentortip', 'Only mentors with valid qualifications can be selected from the mentor resource pool. If you do not select a mentor from the mentor resource pool, the basic qualifications of the mentor will not be verified', 1);
INSERT INTO `i18` VALUES (267, 'baseForm.form.label.mentor', 'Select Mentor Only from Mentor Resource Pool', 1);
INSERT INTO `i18` VALUES (268, 'baseForm.form.label.remindertitle', 'Reminder of coaching communication records', 1);
INSERT INTO `i18` VALUES (269, 'baseForm.form.label.reminder', 'Require Reminder', 1);
INSERT INTO `i18` VALUES (270, 'baseForm.form.label.remark', 'Remarks', 1);
INSERT INTO `i18` VALUES (271, 'baseForm.form.title.detail', 'Detailed Information', 1);
INSERT INTO `i18` VALUES (272, 'baseForm.form.submit', 'Submit', 1);
INSERT INTO `i18` VALUES (273, 'baseForm.form.submit.success', 'Form submitted successfully', 1);
INSERT INTO `i18` VALUES (274, 'baseForm.form.cancel', 'Cancel', 1);
INSERT INTO `i18` VALUES (275, 'baseForm.form.submit.error', 'Please complete the required items first', 1);
INSERT INTO `i18` VALUES (276, 'baseForm.form.record', 'Version Record', 1);
INSERT INTO `i18` VALUES (277, 'baseForm.form.project', 'Project Type', 1);
INSERT INTO `i18` VALUES (278, 'baseForm.form.get.error', 'Failed to obtain data', 1);
INSERT INTO `i18` VALUES (279, 'menu.form.advance', 'Advanced Form', 1);
INSERT INTO `i18` VALUES (280, 'advanceForm.form.basicInfo.title', 'Project Basic Information', 1);
INSERT INTO `i18` VALUES (281, 'advanceForm.form.basicInfo.projectName', 'Project Name', 1);
INSERT INTO `i18` VALUES (282, 'advanceForm.form.basicInfo.position', 'Training Position', 1);
INSERT INTO `i18` VALUES (283, 'advanceForm.form.basicInfo.hr', 'HR', 1);
INSERT INTO `i18` VALUES (284, 'advanceForm.form.basicInfo.teacher', 'Mentor', 1);
INSERT INTO `i18` VALUES (285, 'advanceForm.form.basicInfo.startTime', 'Internship Guidance Start Date', 1);
INSERT INTO `i18` VALUES (286, 'advanceForm.form.basicInfo.endTime', 'Internship Guidance End Date', 1);
INSERT INTO `i18` VALUES (287, 'advanceForm.form.basicInfo.phone', 'Phone Number', 1);
INSERT INTO `i18` VALUES (288, 'advanceForm.form.basicInfo.address', 'Address', 1);
INSERT INTO `i18` VALUES (289, 'advanceForm.form.basicInfo.remark', 'Remarks', 1);
INSERT INTO `i18` VALUES (290, 'advanceForm.form.process.title', 'Task Management', 1);
INSERT INTO `i18` VALUES (291, 'advanceForm.form.process.name', 'Name', 1);
INSERT INTO `i18` VALUES (292, 'advanceForm.form.process.number', 'Employee ID', 1);
INSERT INTO `i18` VALUES (293, 'advanceForm.form.process.department', 'Department Level', 1);
INSERT INTO `i18` VALUES (294, 'advanceForm.form.process.status', 'Status', 1);
INSERT INTO `i18` VALUES (295, 'advanceForm.form.process.runningStatus', 'Running Task Status', 1);
INSERT INTO `i18` VALUES (296, 'advanceForm.form.process.createTime', 'Creation Time', 1);
INSERT INTO `i18` VALUES (297, 'advanceForm.form.process.operation', 'Operations', 1);
INSERT INTO `i18` VALUES (298, 'advanceForm.form.process.add', 'Add a row of data', 1);
INSERT INTO `i18` VALUES (299, 'advanceForm.form.process.save', 'Save', 1);
INSERT INTO `i18` VALUES (300, 'advanceForm.form.process.delete', 'Delete', 1);
INSERT INTO `i18` VALUES (301, 'advanceForm.form.process.edit', 'Edit', 1);
INSERT INTO `i18` VALUES (302, 'advanceForm.form.validError.null', 'Input cannot be empty.', 1);
INSERT INTO `i18` VALUES (303, 'advanceForm.form.validError.add', 'Only one row can be added.', 1);
INSERT INTO `i18` VALUES (304, 'advanceForm.form.delete.title', 'Are you sure to delete this data?', 1);
INSERT INTO `i18` VALUES (305, 'advanceForm.form.nodata', 'No data available', 1);
INSERT INTO `i18` VALUES (306, 'menu.result.success', 'Success', 1);
INSERT INTO `i18` VALUES (307, 'success.result.title', 'The submission result page displays the processing results of a series of operation tasks.', 1);
INSERT INTO `i18` VALUES (308, 'menu.result.messageSuccess', 'The coaching process is submitted successfully', 1);
INSERT INTO `i18` VALUES (309, 'menu.btn.submit', 'Start', 1);
INSERT INTO `i18` VALUES (310, 'menu.btn.cancel', 'Cancel', 1);
INSERT INTO `i18` VALUES (311, 'menu.line.process', 'Current progress', 1);
INSERT INTO `i18` VALUES (312, 'menu.result.messageEnd', 'The coaching process has been submitted', 1);
INSERT INTO `i18` VALUES (313, 'menu.result.error', 'Error', 1);
INSERT INTO `i18` VALUES (314, 'error.result.title', 'The submission result page displays the processing results of a series of operation tasks', 1);
INSERT INTO `i18` VALUES (315, 'menu.result.messageError', 'Failed to submit the coaching process', 1);
INSERT INTO `i18` VALUES (316, 'error.result.home', 'Back', 1);
INSERT INTO `i18` VALUES (317, 'menu.exception.403', '403', 1);
INSERT INTO `i18` VALUES (318, 'exception.result.403.description', 'Access to this resource on the server is denied.', 1);
INSERT INTO `i18` VALUES (319, 'exception.result.403.back', 'Back', 1);
INSERT INTO `i18` VALUES (320, 'exception.result.permissions.403', 'Contact the administrator to apply for the permission.。', 1);
INSERT INTO `i18` VALUES (321, 'menu.exception.404', '404', 1);
INSERT INTO `i18` VALUES (322, 'exception.result.404.description', 'Whoops, this page is gone.', 1);
INSERT INTO `i18` VALUES (323, 'exception.result.404.retry', 'Retry', 1);
INSERT INTO `i18` VALUES (324, 'exception.result.404.back', 'Back', 1);
INSERT INTO `i18` VALUES (325, 'exception.result.permissions.404', 'Check the network connection and try to refresh the page.', 1);
INSERT INTO `i18` VALUES (326, 'menu.exception.500', '500', 1);
INSERT INTO `i18` VALUES (327, 'exception.result.500.description', 'Internal server error', 1);
INSERT INTO `i18` VALUES (328, 'exception.result.500.back', 'Back', 1);
INSERT INTO `i18` VALUES (329, 'exception.result.permissions.500', 'Check the network connection and try to refresh the page.', 1);
INSERT INTO `i18` VALUES (330, 'menu.user.info', 'User Center', 1);
INSERT INTO `i18` VALUES (331, 'userInfo.tab.one', 'My plan', 1);
INSERT INTO `i18` VALUES (332, 'userInfo.tab.two', 'My mission', 1);
INSERT INTO `i18` VALUES (333, 'userInfo.filter.sort', 'Sort by Time', 1);
INSERT INTO `i18` VALUES (334, 'userInfo.filter.startTime', 'Start Date', 1);
INSERT INTO `i18` VALUES (335, 'userInfo.filter.endTime', 'End Date', 1);
INSERT INTO `i18` VALUES (336, 'userInfo.end.positiveOrder', 'By end time in positive order', 1);
INSERT INTO `i18` VALUES (337, 'userInfo.end.reverseOrder', 'In reverse order by end time', 1);
INSERT INTO `i18` VALUES (338, 'userInfo.start.positiveOrder', 'Start time in positive order', 1);
INSERT INTO `i18` VALUES (339, 'userInfo.start.reverseOrder', 'Start time in reverse order', 1);
INSERT INTO `i18` VALUES (340, 'userInfo.btn.search', 'Search', 1);
INSERT INTO `i18` VALUES (341, 'userInfo.btn.reset', 'Reset', 1);
INSERT INTO `i18` VALUES (342, 'userInfo.status.status', 'Status', 1);
INSERT INTO `i18` VALUES (343, 'userInfo.status.optionA', 'Completed', 1);
INSERT INTO `i18` VALUES (344, 'userInfo.status.optionB', 'Overdue', 1);
INSERT INTO `i18` VALUES (345, 'userInfo.status.optionC', 'About to expire', 1);
INSERT INTO `i18` VALUES (346, 'userInfo.status.optionD', 'Unfinished', 1);
INSERT INTO `i18` VALUES (347, 'userInfo.type.type', 'Type', 1);
INSERT INTO `i18` VALUES (348, 'userInfo.type.optionA', 'Organizational arrangements', 1);
INSERT INTO `i18` VALUES (349, 'userInfo.type.optionB', 'Phase Plan', 1);
INSERT INTO `i18` VALUES (350, 'userInfo.type.optionC', 'autonomous learning', 1);
INSERT INTO `i18` VALUES (351, 'userInfo.table.columnA', 'Program Name', 1);
INSERT INTO `i18` VALUES (352, 'userInfo.table.columnB', 'Completion Time', 1);
INSERT INTO `i18` VALUES (353, 'userInfo.table.columnC', 'Status', 1);
INSERT INTO `i18` VALUES (354, 'userInfo.table.columnD', 'Type', 1);
INSERT INTO `i18` VALUES (355, 'userInfo.week.1', '2 weeks onboarding', 1);
INSERT INTO `i18` VALUES (356, 'userInfo.month.1', '1 month onboarding', 1);
INSERT INTO `i18` VALUES (357, 'userInfo.month.2', '2 month onboarding', 1);
INSERT INTO `i18` VALUES (358, 'userInfo.month.3', '3 month onboarding', 1);
INSERT INTO `i18` VALUES (359, 'userInfo.month.4', '4 month onboarding', 1);
INSERT INTO `i18` VALUES (360, 'userInfo.month.5', '5 month onboarding', 1);
INSERT INTO `i18` VALUES (361, 'userInfo.month.6', '6 month onboarding', 1);
INSERT INTO `i18` VALUES (362, 'userInfo.month.7', '7 month onboarding', 1);
INSERT INTO `i18` VALUES (363, 'userInfo.month.8', '8 month onboarding', 1);
INSERT INTO `i18` VALUES (364, 'userInfo.month.9', '9 month onboarding', 1);
INSERT INTO `i18` VALUES (365, 'userInfo.month.10', '10 month onboarding', 1);
INSERT INTO `i18` VALUES (366, 'userInfo.month.11', '11 month onboarding', 1);
INSERT INTO `i18` VALUES (367, 'userInfo.month.12', '12 month onboarding', 1);
INSERT INTO `i18` VALUES (368, 'userInfo.month.13', '13 month onboarding', 1);
INSERT INTO `i18` VALUES (369, 'userInfo.month.14', '14 month onboarding', 1);
INSERT INTO `i18` VALUES (370, 'userInfo.month.15', '15 month onboarding', 1);
INSERT INTO `i18` VALUES (371, 'userInfo.month.16', '16 month onboarding', 1);
INSERT INTO `i18` VALUES (372, 'userInfo.month.17', '17 month onboarding', 1);
INSERT INTO `i18` VALUES (373, 'userInfo.time.message', 'The end time is earlier than the start time', 1);
INSERT INTO `i18` VALUES (374, 'userInfo.filter.all', 'Please complete all current filters', 1);
INSERT INTO `i18` VALUES (375, 'menu.user.setting', 'User Setting', 1);
INSERT INTO `i18` VALUES (376, 'userSetting.cancel', 'Cancel', 1);
INSERT INTO `i18` VALUES (377, 'userSetting.reset', 'Reset', 1);
INSERT INTO `i18` VALUES (378, 'userSetting.department', 'Department:', 1);
INSERT INTO `i18` VALUES (379, 'userSetting.position', 'Position:', 1);
INSERT INTO `i18` VALUES (380, 'userSetting.type', 'Recruitment Type:', 1);
INSERT INTO `i18` VALUES (381, 'userSetting.date', 'Trial Start and End Date:', 1);
INSERT INTO `i18` VALUES (382, 'userSetting.during', 'Probation Period:', 1);
INSERT INTO `i18` VALUES (383, 'userSetting.startTime', 'Labor Contract Start Date:', 1);
INSERT INTO `i18` VALUES (384, 'userSetting.endTime', 'Labor Contract End Date:', 1);
INSERT INTO `i18` VALUES (385, 'userSetting.first', 'Start Time', 1);
INSERT INTO `i18` VALUES (386, 'userSetting.last', 'End Time', 1);
INSERT INTO `i18` VALUES (387, 'menu.plan.department', 'Training Department', 1);
INSERT INTO `i18` VALUES (388, 'menu.plan.resource', 'Human Resource Mgmt Dept', 1);
INSERT INTO `i18` VALUES (389, 'menu.plan.job', 'Job Level', 1);
INSERT INTO `i18` VALUES (390, 'menu.plan.person', 'Person Type', 1);
INSERT INTO `i18` VALUES (391, 'menu.plan.attribute', 'Service attribute', 1);
INSERT INTO `i18` VALUES (392, 'menu.plan.develop', 'Whether to develop', 1);
INSERT INTO `i18` VALUES (393, 'menu.plan.yes', 'yes', 1);
INSERT INTO `i18` VALUES (394, 'menu.plan.no', 'no', 1);
INSERT INTO `i18` VALUES (395, 'menu.plan.role', 'Develop Roles', 1);
INSERT INTO `i18` VALUES (396, 'menu.plan.mentor', 'Mentor', 1);
INSERT INTO `i18` VALUES (397, 'menu.plan.condition', 'Effective Condition', 1);
INSERT INTO `i18` VALUES (398, 'menu.plan.approval', 'Immediate supervisor approval', 1);
INSERT INTO `i18` VALUES (399, 'menu.plan.frequency', 'Formulation frequency', 1);
INSERT INTO `i18` VALUES (400, 'menu.plan.month', 'By Month', 1);
INSERT INTO `i18` VALUES (401, 'menu.plan.goal', 'Goal Setting Role', 1);
INSERT INTO `i18` VALUES (402, 'menu.plan.trainees', 'Trainees', 1);
INSERT INTO `i18` VALUES (403, 'menu.plan.teacher', 'Mentor Approval', 1);
INSERT INTO `i18` VALUES (404, 'menu.plan.phase', 'Phase Evaluation', 1);
INSERT INTO `i18` VALUES (405, 'menu.plan.evaluation', 'Need to be evaluated by mentors and immediate supervisors', 1);
INSERT INTO `i18` VALUES (406, 'menu.plan.whole', 'Overall evaluation', 1);
INSERT INTO `i18` VALUES (407, 'menu.plan.pool', 'Select Mentor Only from Mentor Resource Pool', 1);
INSERT INTO `i18` VALUES (408, 'menu.plan.time', 'Update Time', 1);
INSERT INTO `i18` VALUES (409, 'menu.plan.version', 'Version number', 1);
INSERT INTO `i18` VALUES (410, 'menu.plan.operation', 'Operation', 1);
INSERT INTO `i18` VALUES (411, 'menu.plan.updated', 'Updated by', 1);
INSERT INTO `i18` VALUES (412, 'work.mock.employees', 'Transferred employees', 1);
INSERT INTO `i18` VALUES (413, 'work.mock.onboard', 'New employee onboarding', 1);
INSERT INTO `i18` VALUES (414, 'work.mock.Test', 'Test coaching', 1);
INSERT INTO `i18` VALUES (415, 'work.mock.week1', 'Zero promotion practice (1 weeks)', 1);
INSERT INTO `i18` VALUES (416, 'work.mock.week2', 'Zero promotion practice (2 weeks)', 1);
INSERT INTO `i18` VALUES (417, 'work.mock.week3', 'Zero promotion practice (3 weeks)', 1);
INSERT INTO `i18` VALUES (418, 'work.mock.network', 'Network Reality', 1);
INSERT INTO `i18` VALUES (419, 'work.mock.collectValue1', 'Institutional Learning Video Course', 1);
INSERT INTO `i18` VALUES (420, 'work.mock.collectDescription1', 'Convert attendance, promotion, and other systems into interactive video courses for quick understanding and approval processes (such as leave applications, supervisor approval, HR filing).', 1);
INSERT INTO `i18` VALUES (421, 'work.mock.collectHotLabel1', 'Popular', 1);
INSERT INTO `i18` VALUES (422, 'work.mock.collectLabel2', 'Template for Leave Application Process', 1);
INSERT INTO `i18` VALUES (423, 'work.mock.collectValue2', 'How to become a Business Mentor Classic Course Review', 1);
INSERT INTO `i18` VALUES (424, 'work.mock.collectDescription2', 'Match domain experts according to the skill matrix and track and guide progress in real-time through task dashboards', 1);
INSERT INTO `i18` VALUES (425, 'work.mock.collectLabel3', 'Develop a Personal Development IDP', 1);
INSERT INTO `i18` VALUES (426, 'work.mock.collectValue3', 'Student workbook', 1);
INSERT INTO `i18` VALUES (427, 'work.mock.collectDescription3', 'Build a PK ranking for newcomers in the same period, and generate a \'growth index\' ranking based on learning progress and task completion', 1);
INSERT INTO `i18` VALUES (428, 'work.mock.collectLabel4', 'Experience Sharing Points Pool', 1);
INSERT INTO `i18` VALUES (429, 'work.mock.collectValue4', 'Teacher\'s Online Course Platform', 1);
INSERT INTO `i18` VALUES (430, 'work.mock.collectDescription4', 'Skill training, collaborative support, and dynamic feedback mechanism to build a full lifecycle growth system', 1);
INSERT INTO `i18` VALUES (431, 'work.mock.collectLabel5', 'The Three Order Model of \'Cognition Practice Practice Practice\'', 1);
INSERT INTO `i18` VALUES (432, 'work.mock.centralized', 'Centralized training for new employees', 1);
INSERT INTO `i18` VALUES (433, 'work.mock.hardware', 'Hardware Installation Practice', 1);
INSERT INTO `i18` VALUES (434, 'work.index.learn', 'Learning Planning', 1);
INSERT INTO `i18` VALUES (435, 'work.index.coach', 'Learning coaching', 1);
INSERT INTO `i18` VALUES (436, 'work.index.formalization', 'Learning Formalization', 1);
INSERT INTO `i18` VALUES (437, 'work.index.collect', 'Related Collection Functions', 1);
INSERT INTO `i18` VALUES (438, 'work.index.practiced', 'Learning practiced', 1);
INSERT INTO `i18` VALUES (439, 'work.index.train', 'Centralized training', 1);
INSERT INTO `i18` VALUES (440, 'work.index.Inquiry', 'Life little helper', 1);
INSERT INTO `i18` VALUES (441, 'work.index.Home', 'New Employee Home', 1);
INSERT INTO `i18` VALUES (442, 'work.index.Guide', 'Operation Guide', 1);
INSERT INTO `i18` VALUES (443, 'work.index.plans', 'Number of plans', 1);
INSERT INTO `i18` VALUES (444, 'work.index.Unfinished', 'Unfinished', 1);
INSERT INTO `i18` VALUES (445, 'work.index.beOverdue', 'To Be Overdue', 1);
INSERT INTO `i18` VALUES (446, 'work.index.Overdue', 'Overdue', 1);
INSERT INTO `i18` VALUES (447, 'work.index.trainees', 'Number of trainees to start coaching', 1);
INSERT INTO `i18` VALUES (448, 'work.index.coachNum', 'Number of trainees in coaching', 1);
INSERT INTO `i18` VALUES (449, 'work.index.allocated', 'Number of trainees to be allocated', 1);
INSERT INTO `i18` VALUES (450, 'work.index.start', 'Number of trainees to start practice', 1);
INSERT INTO `i18` VALUES (451, 'work.index.practice', 'Number of trainees in practice', 1);
INSERT INTO `i18` VALUES (452, 'work.index.unpark', 'Waiting for Start-up to Form', 1);
INSERT INTO `i18` VALUES (453, 'work.index.entered', 'Evaluation result to be entered', 1);
INSERT INTO `i18` VALUES (454, 'work.index.approved', 'Evaluation result to be approved', 1);
INSERT INTO `i18` VALUES (455, 'work.index.put', 'Number of trainees in practice', 1);
INSERT INTO `i18` VALUES (456, 'work.index.assign', 'Number of trainees to be allocated', 1);
INSERT INTO `i18` VALUES (457, 'work.index.prepare', 'Prepare for class opening', 1);
INSERT INTO `i18` VALUES (458, 'work.index.open', 'Open a middle class', 1);
INSERT INTO `i18` VALUES (459, 'work.index.classes', 'Number of classes to be accepted', 1);
INSERT INTO `i18` VALUES (460, 'work.index.policy', 'policy', 1);
INSERT INTO `i18` VALUES (461, 'work.index.Period', 'Probation Period and Development Policy Process for New Employees', 1);
INSERT INTO `i18` VALUES (462, 'work.index.Hotline', 'Hotline', 1);
INSERT INTO `i18` VALUES (463, 'work.index.service', 'All kinds of practical hotline service', 1);
INSERT INTO `i18` VALUES (464, 'work.index.Attendance', 'Attendance', 1);
INSERT INTO `i18` VALUES (465, 'work.index.FAQs', 'Attendance System and FAQs', 1);
INSERT INTO `i18` VALUES (466, 'work.index.Payroll', 'Payroll', 1);
INSERT INTO `i18` VALUES (467, 'work.index.Tax', 'Payroll Tax Q&A', 1);
INSERT INTO `i18` VALUES (468, 'work.index.Brave', 'How employees can enhance their professional skills and professional abilities', 1);
INSERT INTO `i18` VALUES (469, 'work.index.Growth', 'Article Update', 1);
INSERT INTO `i18` VALUES (470, 'work.index.Termbase', 'Brave New Century Login Plan', 1);
INSERT INTO `i18` VALUES (471, 'work.index.lingo', 'The latest and hottest terms to help you understand the lingo', 1);
INSERT INTO `i18` VALUES (472, 'work.index.Library', 'New Employee Benefits Notice', 1);
INSERT INTO `i18` VALUES (473, 'work.index.domain', 'Knowledge document library of the business domain', 1);
INSERT INTO `i18` VALUES (474, 'work.index.platform', 'Online learning platform', 1);
INSERT INTO `i18` VALUES (475, 'work.index.learning', 'Online learning', 1);
INSERT INTO `i18` VALUES (476, 'work.index.Operation', 'New Employee Home Operation Guide', 1);
INSERT INTO `i18` VALUES (477, 'work.index.Numbers', 'Number', 1);
INSERT INTO `i18` VALUES (478, 'work.index.Person', 'Person', 1);
INSERT INTO `i18` VALUES (479, 'en-US', 'English', 2);
INSERT INTO `i18` VALUES (480, 'zh-CN', '中文', 2);
INSERT INTO `i18` VALUES (481, 'zh-TW', '中国台湾', 2);
INSERT INTO `i18` VALUES (482, 'hello', '你好 {name}', 2);
INSERT INTO `i18` VALUES (483, 'code', 'zh-CN', 2);
INSERT INTO `i18` VALUES (484, 'yes', '是', 2);
INSERT INTO `i18` VALUES (485, 'no', '否', 2);
INSERT INTO `i18` VALUES (486, 'menu.board', '看板', 2);
INSERT INTO `i18` VALUES (487, 'menu.home', '监控页', 2);
INSERT INTO `i18` VALUES (488, 'menu.work', '工作台', 2);
INSERT INTO `i18` VALUES (489, 'menu.list', '列表页', 2);
INSERT INTO `i18` VALUES (490, 'menu.result', '结果页', 2);
INSERT INTO `i18` VALUES (491, 'menu.exception', '异常页', 2);
INSERT INTO `i18` VALUES (492, 'menu.form', '表单页', 2);
INSERT INTO `i18` VALUES (493, 'menu.profile', '详情页', 2);
INSERT INTO `i18` VALUES (494, 'menu.profile.detail', '基础详情页', 2);
INSERT INTO `i18` VALUES (495, 'menu.visualization', '数据可视化', 2);
INSERT INTO `i18` VALUES (496, 'menu.menuPage', '菜单页', 2);
INSERT INTO `i18` VALUES (497, 'menu.menuPage.second', '二级菜单', 2);
INSERT INTO `i18` VALUES (498, 'menu.menuPage.third', '菜单demo页', 2);
INSERT INTO `i18` VALUES (499, 'menu.user', '个人中心', 2);
INSERT INTO `i18` VALUES (500, 'menu.systemManager', '系统管理', 2);
INSERT INTO `i18` VALUES (501, 'menu.userManager', '用户管理', 2);
INSERT INTO `i18` VALUES (502, 'menu.userManager.info', '查看用户', 2);
INSERT INTO `i18` VALUES (503, 'menu.userManager.setting', '修改信息', 2);
INSERT INTO `i18` VALUES (504, 'menu.userManager.useradd', '添加用户', 2);
INSERT INTO `i18` VALUES (505, 'menu.permission', '权限管理', 2);
INSERT INTO `i18` VALUES (506, 'menu.permission.info', '查看权限', 2);
INSERT INTO `i18` VALUES (507, 'menu.permission.setting', '修改权限', 2);
INSERT INTO `i18` VALUES (508, 'menu.permission.permissionAdd', '添加权限', 2);
INSERT INTO `i18` VALUES (509, 'menu.role', '角色管理', 2);
INSERT INTO `i18` VALUES (510, 'menu.role.info', '查看角色', 2);
INSERT INTO `i18` VALUES (511, 'menu.menu', '菜单管理', 2);
INSERT INTO `i18` VALUES (512, 'menu.menu.info', '查看菜单', 2);
INSERT INTO `i18` VALUES (513, 'navbar.docs', '文档中心', 2);
INSERT INTO `i18` VALUES (514, 'navbar.action.locale', '切换为中文', 2);
INSERT INTO `i18` VALUES (515, 'messageBox.switchRoles', '切换角色', 2);
INSERT INTO `i18` VALUES (516, 'messageBox.userCenter', '用户中心', 2);
INSERT INTO `i18` VALUES (517, 'messageBox.userSettings', '用户设置', 2);
INSERT INTO `i18` VALUES (518, 'messageBox.logout', '退出登录', 2);
INSERT INTO `i18` VALUES (519, 'messageBox.updatePwd', '修改密码', 2);
INSERT INTO `i18` VALUES (520, 'message.delete.success', '删除成功', 2);
INSERT INTO `i18` VALUES (521, 'menu.cloud', '云服务能力展示', 2);
INSERT INTO `i18` VALUES (522, 'menu.btn.confirm', '确认', 2);
INSERT INTO `i18` VALUES (523, 'menu.i18n', '国际化管理', 2);
INSERT INTO `i18` VALUES (524, 'theme.title.main', '个性化配置', 2);
INSERT INTO `i18` VALUES (525, 'theme.title.first', '主题', 2);
INSERT INTO `i18` VALUES (526, 'theme.title.default', '默认主题', 2);
INSERT INTO `i18` VALUES (527, 'theme.title.honey', '蜜糖主题', 2);
INSERT INTO `i18` VALUES (528, 'theme.title.violet', '紫罗兰主题', 2);
INSERT INTO `i18` VALUES (529, 'theme.title.deepness', '深邃夜空主题', 2);
INSERT INTO `i18` VALUES (530, 'theme.title.deep', '深色主题', 2);
INSERT INTO `i18` VALUES (531, 'theme.title.light', '浅色主题', 2);
INSERT INTO `i18` VALUES (532, 'theme.title.customization', '自定义主题', 2);
INSERT INTO `i18` VALUES (533, 'theme-title-recommend', '推荐主题', 2);
INSERT INTO `i18` VALUES (534, 'theme-text-default', '科技、探索、钻研、精尖、包容', 2);
INSERT INTO `i18` VALUES (535, 'theme-text-honey', '明快、感性、温暖、积极、活力', 2);
INSERT INTO `i18` VALUES (536, 'theme-text-violet', '优雅、浪漫、温柔、神秘、高贵', 2);
INSERT INTO `i18` VALUES (537, 'theme-text-deepness', '平稳、中性、空间、力量、坚硬', 2);
INSERT INTO `i18` VALUES (538, 'theme-text-dark', '深沉、果断、勇敢、坚韧、向往', 2);
INSERT INTO `i18` VALUES (539, 'settings.title', '页面配置', 2);
INSERT INTO `i18` VALUES (540, 'settings.themeColor', '主题色', 2);
INSERT INTO `i18` VALUES (541, 'settings.content', '内容区域', 2);
INSERT INTO `i18` VALUES (542, 'settings.search', '搜索', 2);
INSERT INTO `i18` VALUES (543, 'settings.language', '语言', 2);
INSERT INTO `i18` VALUES (544, 'settings.navbar', '简约模式', 2);
INSERT INTO `i18` VALUES (545, 'settings.menuWidth', '菜单宽度 (px)', 2);
INSERT INTO `i18` VALUES (546, 'settings.navbar.alerts', '消息通知', 2);
INSERT INTO `i18` VALUES (547, 'settings.navbar.help', '帮助中心', 2);
INSERT INTO `i18` VALUES (548, 'settings.menu', '经典模式', 2);
INSERT INTO `i18` VALUES (549, 'settings.tabBar', '多页签', 2);
INSERT INTO `i18` VALUES (550, 'settings.footer', '时尚模式', 2);
INSERT INTO `i18` VALUES (551, 'settings.colorWeek', '主题配置', 2);
INSERT INTO `i18` VALUES (552, 'settings.alertContent', '配置之后仅是临时生效，要想真正作用于项目，点击下方的 \"复制配置\" 按钮，将配置替换到 settings.json 中即可。', 2);
INSERT INTO `i18` VALUES (553, 'settings.copySettings', '复制配置', 2);
INSERT INTO `i18` VALUES (554, 'settings.copySettings.message', '复制成功，请粘贴到 src/settings.json 文件中', 2);
INSERT INTO `i18` VALUES (555, 'settings.close', '关闭', 2);
INSERT INTO `i18` VALUES (556, 'settings.color.tooltip', '根据主题颜色生成的 10 个梯度色（将配置复制到项目中，主题色才能对亮色 / 暗黑模式同时生效）', 2);
INSERT INTO `i18` VALUES (557, 'setting.user.set', '用户设置', 2);
INSERT INTO `i18` VALUES (558, 'setting.loginout', '登出成功', 2);
INSERT INTO `i18` VALUES (559, 'setting.copy', '复制成功', 2);
INSERT INTO `i18` VALUES (560, 'setting.input.search', '请输入关键词', 2);
INSERT INTO `i18` VALUES (561, 'setting.foot.title', 'OpenCangjie 出品', 2);
INSERT INTO `i18` VALUES (562, 'setting.mode.navbar', '收起页头，页尾', 2);
INSERT INTO `i18` VALUES (563, 'setting.mode.menu', '收起菜单', 2);
INSERT INTO `i18` VALUES (564, 'setting.mode.footer', '收起页脚', 2);
INSERT INTO `i18` VALUES (565, 'login.form.mode', '账号密码登录', 2);
INSERT INTO `i18` VALUES (566, 'login.form.mail', '邮箱登录', 2);
INSERT INTO `i18` VALUES (567, 'login.form.title', '登录 Tiny Pro', 2);
INSERT INTO `i18` VALUES (568, 'login.form.userName.errMsg', '用户名不能为空', 2);
INSERT INTO `i18` VALUES (569, 'login.form.password.errMsg', '密码不能为空', 2);
INSERT INTO `i18` VALUES (570, 'login.form.mailName.errMsg', '邮箱名不能为空', 2);
INSERT INTO `i18` VALUES (571, 'login.form.mailpassword.errMsg', '邮箱密码不能为空', 2);
INSERT INTO `i18` VALUES (572, 'login.form.mailpassword2.errMsg', '确认密码不能为空', 2);
INSERT INTO `i18` VALUES (573, 'login.form.login.errMsg', '登录出错，轻刷新重试', 2);
INSERT INTO `i18` VALUES (574, 'login.form.login.success', '欢迎使用', 2);
INSERT INTO `i18` VALUES (575, 'login.form.userName.placeholder', '用户名：admin', 2);
INSERT INTO `i18` VALUES (576, 'login.form.password.placeholder', '密码：admin', 2);
INSERT INTO `i18` VALUES (577, 'login.form.mailName.placeholder', '邮箱名：123{\'@\'}example.com', 2);
INSERT INTO `i18` VALUES (578, 'login.form.mailpassword.placeholder', '密码：admin', 2);
INSERT INTO `i18` VALUES (579, 'login.form.registerMail.placeholder', '注册邮箱：', 2);
INSERT INTO `i18` VALUES (580, 'login.form.registerPassword.placeholder', '注册密码：', 2);
INSERT INTO `i18` VALUES (581, 'login.form.registerConfirmPassword.placeholder', '确认密码：', 2);
INSERT INTO `i18` VALUES (582, 'login.form.rememberPassword', '记住密码', 2);
INSERT INTO `i18` VALUES (583, 'login.form.forgetPassword', '忘记密码', 2);
INSERT INTO `i18` VALUES (584, 'login.form.registration', '注册账户', 2);
INSERT INTO `i18` VALUES (585, 'login.form.login', '登录', 2);
INSERT INTO `i18` VALUES (586, 'login.form.register', '注册', 2);
INSERT INTO `i18` VALUES (587, 'login.form.registerPass', '校验通过，注册成功', 2);
INSERT INTO `i18` VALUES (588, 'login.form.registerError', '校验不通过!', 2);
INSERT INTO `i18` VALUES (589, 'login.form.change', '使用已有账户登录', 2);
INSERT INTO `i18` VALUES (590, 'login.form.mailInput', '邮箱:', 2);
INSERT INTO `i18` VALUES (591, 'login.form.passwordInput', '密码:', 2);
INSERT INTO `i18` VALUES (592, 'login.form.passwordConfirm', '确认密码:', 2);
INSERT INTO `i18` VALUES (593, 'login.form.checkUsername', '字母、数字、下划线、短线、点号{\'@\'}字母、数字、短线', 2);
INSERT INTO `i18` VALUES (594, 'login.form.checkPassword', '最少八个字符，至少包含一个大写字母，一个小写字母和一个数字', 2);
INSERT INTO `i18` VALUES (595, 'login.form.confirmPassword', '密码输入不一致', 2);
INSERT INTO `i18` VALUES (596, 'login.banner.slogan1', '开箱即用的高质量模板', 2);
INSERT INTO `i18` VALUES (597, 'login.banner.subSlogan1', '丰富的的页面模板，覆盖大多数典型业务场景', 2);
INSERT INTO `i18` VALUES (598, 'login.banner.slogan2', '内置了常见问题的解决方案', 2);
INSERT INTO `i18` VALUES (599, 'login.banner.subSlogan2', '国际化，路由配置，状态管理应有尽有', 2);
INSERT INTO `i18` VALUES (600, 'login.banner.slogan3', '接入可视化增强工具AUX', 2);
INSERT INTO `i18` VALUES (601, 'login.banner.subSlogan3', '实现灵活的区块式开发', 2);
INSERT INTO `i18` VALUES (602, 'login.icon.language', '语言', 2);
INSERT INTO `i18` VALUES (603, 'login.tip.info', '用户名：admin，密码 admin', 2);
INSERT INTO `i18` VALUES (604, 'login.tip.mail', '用户名：admin{\'@\'}no-reply.com，密码 admin', 2);
INSERT INTO `i18` VALUES (605, 'login.tip.right', '请输入正确的用户名密码', 2);
INSERT INTO `i18` VALUES (606, 'login.main.text', 'AgentSkills管理平台', 2);
INSERT INTO `i18` VALUES (607, 'menu.list.cardList', '卡片列表', 2);
INSERT INTO `i18` VALUES (608, 'cardList.title', '服务应用', 2);
INSERT INTO `i18` VALUES (609, 'cardList.options.all', '全部应用', 2);
INSERT INTO `i18` VALUES (610, 'cardList.options.services', '开发服务', 2);
INSERT INTO `i18` VALUES (611, 'cardList.options.design', '交互设计', 2);
INSERT INTO `i18` VALUES (612, 'cardList.search.placeholder', '输入关键字搜索、过滤', 2);
INSERT INTO `i18` VALUES (613, 'menu.list.searchTable', '查询表格', 2);
INSERT INTO `i18` VALUES (614, 'searchTable.form.placeholder', '请选择属性， 或输入关键字搜索', 2);
INSERT INTO `i18` VALUES (615, 'searchTable.form.number', '集合编号', 2);
INSERT INTO `i18` VALUES (616, 'searchTable.form.number.placeholder', '请输入集合编号', 2);
INSERT INTO `i18` VALUES (617, 'searchTable.form.name', '集合名称', 2);
INSERT INTO `i18` VALUES (618, 'searchTable.form.name.placeholder', '请输入集合名称', 2);
INSERT INTO `i18` VALUES (619, 'searchTable.form.contentType', '内容体裁', 2);
INSERT INTO `i18` VALUES (620, 'searchTable.form.contentType.img', '图文', 2);
INSERT INTO `i18` VALUES (621, 'searchTable.form.contentType.horizontalVideo', '横版短视频', 2);
INSERT INTO `i18` VALUES (622, 'searchTable.form.contentType.verticalVideo', '竖版小视频', 2);
INSERT INTO `i18` VALUES (623, 'searchTable.form.filterType', '筛选方式', 2);
INSERT INTO `i18` VALUES (624, 'searchTable.form.filterType.artificial', '人工筛选', 2);
INSERT INTO `i18` VALUES (625, 'searchTable.form.filterType.rules', '规则筛选', 2);
INSERT INTO `i18` VALUES (626, 'searchTable.form.createdTime', '创建时间', 2);
INSERT INTO `i18` VALUES (627, 'searchTable.form.status', '状态', 2);
INSERT INTO `i18` VALUES (628, 'searchTable.form.status.online', '已上线', 2);
INSERT INTO `i18` VALUES (629, 'searchTable.form.status.offline', '已下线', 2);
INSERT INTO `i18` VALUES (630, 'searchTable.form.status.doing', '进行中', 2);
INSERT INTO `i18` VALUES (631, 'searchTable.form.search', '查询', 2);
INSERT INTO `i18` VALUES (632, 'searchTable.form.reset', '重置', 2);
INSERT INTO `i18` VALUES (633, 'searchTable.form.selectDefault', '全部', 2);
INSERT INTO `i18` VALUES (634, 'searchTable.operation.create', '新建', 2);
INSERT INTO `i18` VALUES (635, 'searchTable.operation.import', '批量导出', 2);
INSERT INTO `i18` VALUES (636, 'searchTable.operation.download', '下载', 2);
INSERT INTO `i18` VALUES (637, 'searchTable.form.collapse', '收起', 2);
INSERT INTO `i18` VALUES (638, 'searchTable.form.extend', '展开', 2);
INSERT INTO `i18` VALUES (639, 'searchTable.form.input', '请输入', 2);
INSERT INTO `i18` VALUES (640, 'searchTable.form.create', '创建主题', 2);
INSERT INTO `i18` VALUES (641, 'searchTable.columns.employeeNo', '工号', 2);
INSERT INTO `i18` VALUES (642, 'searchTable.columns.name', '姓名', 2);
INSERT INTO `i18` VALUES (643, 'searchTable.columns.department', '部门', 2);
INSERT INTO `i18` VALUES (644, 'searchTable.columns.departmentLevel', '部门层级', 2);
INSERT INTO `i18` VALUES (645, 'searchTable.columns.count', '内容量', 2);
INSERT INTO `i18` VALUES (646, 'searchTable.columns.workbenchName', '工作名称', 2);
INSERT INTO `i18` VALUES (647, 'searchTable.columns.project', '赋能项目', 2);
INSERT INTO `i18` VALUES (648, 'searchTable.columns.type', '人员类型', 2);
INSERT INTO `i18` VALUES (649, 'searchTable.columns.address', '研究所', 2);
INSERT INTO `i18` VALUES (650, 'searchTable.columns.roles', '角色', 2);
INSERT INTO `i18` VALUES (651, 'searchTable.columns.lastUpdateUser', '最后更新人', 2);
INSERT INTO `i18` VALUES (652, 'searchTable.columns.createTime', '创建时间', 2);
INSERT INTO `i18` VALUES (653, 'searchTable.columns.status', '状态', 2);
INSERT INTO `i18` VALUES (654, 'searchTable.columns.operations', '操作', 2);
INSERT INTO `i18` VALUES (655, 'searchTable.columns.operations.view', '查看', 2);
INSERT INTO `i18` VALUES (656, 'searchTable.columns.operations.delete', '删除', 2);
INSERT INTO `i18` VALUES (657, 'searchTable.collapse.restores', '还原', 2);
INSERT INTO `i18` VALUES (658, 'searchTable.collapse.full', '全屏', 2);
INSERT INTO `i18` VALUES (659, 'menu.form.step', '分步表单', 2);
INSERT INTO `i18` VALUES (660, 'stepForm.button.next', '下一步', 2);
INSERT INTO `i18` VALUES (661, 'stepForm.button.submit', '创建', 2);
INSERT INTO `i18` VALUES (662, 'stepForm.button.cancel', '取消', 2);
INSERT INTO `i18` VALUES (663, 'stepForm.button.restore', '重置', 2);
INSERT INTO `i18` VALUES (664, 'stepForm.probation.day', '天', 2);
INSERT INTO `i18` VALUES (665, 'stepForm.coaching.process', '步骤表单', 2);
INSERT INTO `i18` VALUES (666, 'stepForm.start.date', '劳动合同开始日期', 2);
INSERT INTO `i18` VALUES (667, 'stepForm.end.date', '劳动合同结束日期', 2);
INSERT INTO `i18` VALUES (668, 'stepForm.probation.period', '试用期时长', 2);
INSERT INTO `i18` VALUES (669, 'stepForm.probation.start', '试用起止日期', 2);
INSERT INTO `i18` VALUES (670, 'stepForm.recruitment.type', '招聘类型', 2);
INSERT INTO `i18` VALUES (671, 'stepForm.recruitment.position', '职位', 2);
INSERT INTO `i18` VALUES (672, 'stepForm.recruitment.department', '所属部门', 2);
INSERT INTO `i18` VALUES (673, 'stepForm.start.coaching', '启动辅导', 2);
INSERT INTO `i18` VALUES (674, 'stepForm.immediate.supervisor', '录入主管', 2);
INSERT INTO `i18` VALUES (675, 'stepForm.overall.goals', '制定整体目标', 2);
INSERT INTO `i18` VALUES (676, 'stepForm.overall.summary', '提交整体总结', 2);
INSERT INTO `i18` VALUES (677, 'stepForm.overall.end', '结束', 2);
INSERT INTO `i18` VALUES (678, 'stepForm.collapse.base', '辅导基本信息', 2);
INSERT INTO `i18` VALUES (679, 'stepForm.collapse.supervisor', '录入主管', 2);
INSERT INTO `i18` VALUES (680, 'stepForm.collapse.goals', '制定整体目标', 2);
INSERT INTO `i18` VALUES (681, 'stepForm.collapse.summary', '提交整体总结', 2);
INSERT INTO `i18` VALUES (682, 'stepForm.coach.position', '培养职位', 2);
INSERT INTO `i18` VALUES (683, 'stepForm.coach.culture', '培养部门', 2);
INSERT INTO `i18` VALUES (684, 'stepForm.coach.mentor', '导师', 2);
INSERT INTO `i18` VALUES (685, 'stepForm.coach.startTime', '实际辅导开始日期', 2);
INSERT INTO `i18` VALUES (686, 'stepForm.coach.endTime', '实际辅导结束日期', 2);
INSERT INTO `i18` VALUES (687, 'stepForm.dire.supervisor', '导师主管', 2);
INSERT INTO `i18` VALUES (688, 'stepForm.dire.remarks', '导师信息备注', 2);
INSERT INTO `i18` VALUES (689, 'stepForm.dire.startTime', '开始辅导日期', 2);
INSERT INTO `i18` VALUES (690, 'stepForm.dire.endTime', '结束辅导日期', 2);
INSERT INTO `i18` VALUES (691, 'stepForm.target.list', '目标列表', 2);
INSERT INTO `i18` VALUES (692, 'stepForm.target.sure', '确立目标', 2);
INSERT INTO `i18` VALUES (693, 'stepForm.sum.self', '自我总结', 2);
INSERT INTO `i18` VALUES (694, 'stepForm.error.target', '右侧至少存在一项', 2);
INSERT INTO `i18` VALUES (695, 'stepForm.head.admin', '用户名', 2);
INSERT INTO `i18` VALUES (696, 'menu.form.base', '基础表单', 2);
INSERT INTO `i18` VALUES (697, 'baseForm.form.label.no', '否', 2);
INSERT INTO `i18` VALUES (698, 'baseForm.form.label.yes', '是', 2);
INSERT INTO `i18` VALUES (699, 'baseForm.form.label.placeholder', '请选择', 2);
INSERT INTO `i18` VALUES (700, 'baseForm.form.label.frequencyone', '按月', 2);
INSERT INTO `i18` VALUES (701, 'baseForm.form.label.frequencytwo', '按周', 2);
INSERT INTO `i18` VALUES (702, 'baseForm.form.label.frequencythree', '按双周', 2);
INSERT INTO `i18` VALUES (703, 'baseForm.form.label.frequencyfour', '按季度', 2);
INSERT INTO `i18` VALUES (704, 'baseForm.form.label.personone', '本地员工', 2);
INSERT INTO `i18` VALUES (705, 'baseForm.form.label.persontwo', '非雇员', 2);
INSERT INTO `i18` VALUES (706, 'baseForm.form.label.personthree', '中方员工', 2);
INSERT INTO `i18` VALUES (707, 'baseForm.form.label.projectone', '制造部新员工培训', 2);
INSERT INTO `i18` VALUES (708, 'baseForm.form.label.projecttwo', '公司新员工上岗辅导', 2);
INSERT INTO `i18` VALUES (709, 'baseForm.form.label.projectthree', 'UI自动化测试辅导项目', 2);
INSERT INTO `i18` VALUES (710, 'baseForm.form.label.people', '适用人群', 2);
INSERT INTO `i18` VALUES (711, 'baseForm.form.label.rank', '职级', 2);
INSERT INTO `i18` VALUES (712, 'baseForm.form.label.type', '项目类型', 2);
INSERT INTO `i18` VALUES (713, 'baseForm.form.label.business', '业务属性', 2);
INSERT INTO `i18` VALUES (714, 'baseForm.form.label.Objectives', '整体目标', 2);
INSERT INTO `i18` VALUES (715, 'baseForm.form.label.culture', '培养部门', 2);
INSERT INTO `i18` VALUES (716, 'baseForm.form.label.develop', '制定', 2);
INSERT INTO `i18` VALUES (717, 'baseForm.form.label.developone', '学员', 2);
INSERT INTO `i18` VALUES (718, 'baseForm.form.label.developtwo', '导师', 2);
INSERT INTO `i18` VALUES (719, 'baseForm.form.label.effective', '生效条件', 2);
INSERT INTO `i18` VALUES (720, 'baseForm.form.label.effectiveone', '无需审批直接生效', 2);
INSERT INTO `i18` VALUES (721, 'baseForm.form.label.effectivetwo', '导师审批', 2);
INSERT INTO `i18` VALUES (722, 'baseForm.form.label.effectivethree', '直接主管审批', 2);
INSERT INTO `i18` VALUES (723, 'baseForm.form.label.effectivefour', '导师,直接主管审批', 2);
INSERT INTO `i18` VALUES (724, 'baseForm.form.label.plan', '阶段计划', 2);
INSERT INTO `i18` VALUES (725, 'baseForm.form.label.confirm', '是否需制定', 2);
INSERT INTO `i18` VALUES (726, 'baseForm.form.label.frequency', '制定频次', 2);
INSERT INTO `i18` VALUES (727, 'baseForm.form.label.role', '目标制定角色', 2);
INSERT INTO `i18` VALUES (728, 'baseForm.form.label.roleone', '学员', 2);
INSERT INTO `i18` VALUES (729, 'baseForm.form.label.roletwo', '导师', 2);
INSERT INTO `i18` VALUES (730, 'baseForm.form.label.condition', '目标生效条件', 2);
INSERT INTO `i18` VALUES (731, 'baseForm.form.label.conditionone', '无需审批直接生效', 2);
INSERT INTO `i18` VALUES (732, 'baseForm.form.label.conditiontwo', '导师审批', 2);
INSERT INTO `i18` VALUES (733, 'baseForm.form.label.conditionthree', '直接主管审批', 2);
INSERT INTO `i18` VALUES (734, 'baseForm.form.label.conditionfour', '导师,直接主管审批', 2);
INSERT INTO `i18` VALUES (735, 'baseForm.form.label.staged', '阶段评价', 2);
INSERT INTO `i18` VALUES (736, 'baseForm.form.label.stagedone', '仅需导师评价', 2);
INSERT INTO `i18` VALUES (737, 'baseForm.form.label.stagedtwo', '仅需直接主管评价', 2);
INSERT INTO `i18` VALUES (738, 'baseForm.form.label.stagedthree', '需导师,直接主管评价', 2);
INSERT INTO `i18` VALUES (739, 'baseForm.form.label.wholeconfirm', '是否需制定', 2);
INSERT INTO `i18` VALUES (740, 'baseForm.form.label.evaluation', '整体评价', 2);
INSERT INTO `i18` VALUES (741, 'baseForm.form.label.evaluationyes', '需要导师,直接主管评价', 2);
INSERT INTO `i18` VALUES (742, 'baseForm.form.label.evaluationno', '不需要导师,直接主管评价', 2);
INSERT INTO `i18` VALUES (743, 'baseForm.form.label.mentortitle', '导师选择', 2);
INSERT INTO `i18` VALUES (744, 'baseForm.form.label.mentortip', '从导师资源池只能选择导师资格有效的导师，如不从导师资源池选择则不对导师做导师基础资质校验。', 2);
INSERT INTO `i18` VALUES (745, 'baseForm.form.label.mentor', '是否仅从导师资源池选择导师', 2);
INSERT INTO `i18` VALUES (746, 'baseForm.form.label.remindertitle', '辅导沟通记录提醒', 2);
INSERT INTO `i18` VALUES (747, 'baseForm.form.label.reminder', '是否需要提醒', 2);
INSERT INTO `i18` VALUES (748, 'baseForm.form.label.remark', '备注', 2);
INSERT INTO `i18` VALUES (749, 'baseForm.form.title.detail', '详细信息', 2);
INSERT INTO `i18` VALUES (750, 'baseForm.form.submit', '提交', 2);
INSERT INTO `i18` VALUES (751, 'baseForm.form.submit.success', '表单提交成功', 2);
INSERT INTO `i18` VALUES (752, 'baseForm.form.cancel', '取消', 2);
INSERT INTO `i18` VALUES (753, 'baseForm.form.submit.error', '请先完成必填项', 2);
INSERT INTO `i18` VALUES (754, 'baseForm.form.record', '版本记录', 2);
INSERT INTO `i18` VALUES (755, 'baseForm.form.project', '项目类型', 2);
INSERT INTO `i18` VALUES (756, 'baseForm.form.get.error', '获取数据失败', 2);
INSERT INTO `i18` VALUES (757, 'menu.form.advance', '高级表单', 2);
INSERT INTO `i18` VALUES (758, 'advanceForm.form.basicInfo.title', '项目基本信息', 2);
INSERT INTO `i18` VALUES (759, 'advanceForm.form.basicInfo.projectName', '项目名称', 2);
INSERT INTO `i18` VALUES (760, 'advanceForm.form.basicInfo.position', '培养职位', 2);
INSERT INTO `i18` VALUES (761, 'advanceForm.form.basicInfo.hr', 'HR', 2);
INSERT INTO `i18` VALUES (762, 'advanceForm.form.basicInfo.teacher', '导师', 2);
INSERT INTO `i18` VALUES (763, 'advanceForm.form.basicInfo.startTime', '实习辅导开始日期', 2);
INSERT INTO `i18` VALUES (764, 'advanceForm.form.basicInfo.endTime', '实习辅导结束日期', 2);
INSERT INTO `i18` VALUES (765, 'advanceForm.form.basicInfo.phone', '电话号码', 2);
INSERT INTO `i18` VALUES (766, 'advanceForm.form.basicInfo.address', '地址', 2);
INSERT INTO `i18` VALUES (767, 'advanceForm.form.basicInfo.remark', '备注', 2);
INSERT INTO `i18` VALUES (768, 'advanceForm.form.process.title', '任务管理', 2);
INSERT INTO `i18` VALUES (769, 'advanceForm.form.process.name', '姓名', 2);
INSERT INTO `i18` VALUES (770, 'advanceForm.form.process.number', '工号', 2);
INSERT INTO `i18` VALUES (771, 'advanceForm.form.process.department', '部门层级', 2);
INSERT INTO `i18` VALUES (772, 'advanceForm.form.process.status', '状态', 2);
INSERT INTO `i18` VALUES (773, 'advanceForm.form.process.runningStatus', '运行任务状态', 2);
INSERT INTO `i18` VALUES (774, 'advanceForm.form.process.createTime', '创建时间', 2);
INSERT INTO `i18` VALUES (775, 'advanceForm.form.process.operation', '操作', 2);
INSERT INTO `i18` VALUES (776, 'advanceForm.form.process.add', '添加一行数据', 2);
INSERT INTO `i18` VALUES (777, 'advanceForm.form.process.save', '保存', 2);
INSERT INTO `i18` VALUES (778, 'advanceForm.form.process.delete', '删除', 2);
INSERT INTO `i18` VALUES (779, 'advanceForm.form.process.edit', '编辑', 2);
INSERT INTO `i18` VALUES (780, 'advanceForm.form.validError.null', '输入不能为空。', 2);
INSERT INTO `i18` VALUES (781, 'advanceForm.form.validError.add', '只能新增一行。', 2);
INSERT INTO `i18` VALUES (782, 'advanceForm.form.delete.title', '确定要删除该数据吗？', 2);
INSERT INTO `i18` VALUES (783, 'advanceForm.form.nodata', '暂无数据', 2);
INSERT INTO `i18` VALUES (784, 'menu.result.success', '成功页', 2);
INSERT INTO `i18` VALUES (785, 'success.result.title', '提交结果页用于反馈一系列操作任务的处理结果。', 2);
INSERT INTO `i18` VALUES (786, 'menu.result.messageSuccess', '辅导流程提交成功！', 2);
INSERT INTO `i18` VALUES (787, 'menu.result.messageEnd', '辅导流程已提交结束！', 2);
INSERT INTO `i18` VALUES (788, 'menu.btn.submit', '启动新的辅导', 2);
INSERT INTO `i18` VALUES (789, 'menu.btn.cancel', '取消', 2);
INSERT INTO `i18` VALUES (790, 'menu.line.process', '当前进度', 2);
INSERT INTO `i18` VALUES (791, 'menu.result.error', '失败页', 2);
INSERT INTO `i18` VALUES (792, 'error.result.title', '提交结果页用于反馈一系列操作任务的处理结果。', 2);
INSERT INTO `i18` VALUES (793, 'menu.result.messageError', '辅导流程提交失败', 2);
INSERT INTO `i18` VALUES (794, 'error.result.home', '回到首页', 2);
INSERT INTO `i18` VALUES (795, 'menu.exception.403', '403', 2);
INSERT INTO `i18` VALUES (796, 'exception.result.403.description', '对不起，您没有访问该资源的权限', 2);
INSERT INTO `i18` VALUES (797, 'exception.result.403.back', '返回', 2);
INSERT INTO `i18` VALUES (798, 'exception.result.permissions.403', '请联系管理员，申请权限。', 2);
INSERT INTO `i18` VALUES (799, 'menu.exception.404', '404', 2);
INSERT INTO `i18` VALUES (800, 'exception.result.404.description', '抱歉，页面不见了～', 2);
INSERT INTO `i18` VALUES (801, 'exception.result.404.retry', '重试', 2);
INSERT INTO `i18` VALUES (802, 'exception.result.404.back', '返回', 2);
INSERT INTO `i18` VALUES (803, 'exception.result.permissions.404', '请查看网络连接情况，尝试刷新页面', 2);
INSERT INTO `i18` VALUES (804, 'menu.exception.500', '500', 2);
INSERT INTO `i18` VALUES (805, 'exception.result.500.description', '抱歉，服务器出了点问题～', 2);
INSERT INTO `i18` VALUES (806, 'exception.result.500.back', '返回', 2);
INSERT INTO `i18` VALUES (807, 'exception.result.permissions.500', '请查看网络连接情况，尝试刷新页面', 2);
INSERT INTO `i18` VALUES (808, 'menu.user.info', '用户中心', 2);
INSERT INTO `i18` VALUES (809, 'userInfo.tab.one', '我的计划', 2);
INSERT INTO `i18` VALUES (810, 'userInfo.tab.two', '我的任务', 2);
INSERT INTO `i18` VALUES (811, 'userInfo.filter.sort', '按时间排序', 2);
INSERT INTO `i18` VALUES (812, 'userInfo.filter.startTime', '开始日期', 2);
INSERT INTO `i18` VALUES (813, 'userInfo.filter.endTime', '结束日期', 2);
INSERT INTO `i18` VALUES (814, 'userInfo.end.positiveOrder', '按截止时间正序', 2);
INSERT INTO `i18` VALUES (815, 'userInfo.end.reverseOrder', '按截止时间逆序', 2);
INSERT INTO `i18` VALUES (816, 'userInfo.start.positiveOrder', '按开始时间正序', 2);
INSERT INTO `i18` VALUES (817, 'userInfo.start.reverseOrder', '按开始时间逆序', 2);
INSERT INTO `i18` VALUES (818, 'userInfo.btn.search', '查询', 2);
INSERT INTO `i18` VALUES (819, 'userInfo.btn.reset', '重置', 2);
INSERT INTO `i18` VALUES (820, 'userInfo.status.status', '状态', 2);
INSERT INTO `i18` VALUES (821, 'userInfo.status.optionA', '已完成', 2);
INSERT INTO `i18` VALUES (822, 'userInfo.status.optionB', '已逾期', 2);
INSERT INTO `i18` VALUES (823, 'userInfo.status.optionC', '即将逾期', 2);
INSERT INTO `i18` VALUES (824, 'userInfo.status.optionD', '未完成', 2);
INSERT INTO `i18` VALUES (825, 'userInfo.type.type', '类型', 2);
INSERT INTO `i18` VALUES (826, 'userInfo.type.optionA', '组织安排', 2);
INSERT INTO `i18` VALUES (827, 'userInfo.type.optionB', '阶段计划', 2);
INSERT INTO `i18` VALUES (828, 'userInfo.type.optionC', '自主学习', 2);
INSERT INTO `i18` VALUES (829, 'userInfo.table.columnA', '计划名称', 2);
INSERT INTO `i18` VALUES (830, 'userInfo.table.columnB', '完成时间', 2);
INSERT INTO `i18` VALUES (831, 'userInfo.table.columnC', '状态', 2);
INSERT INTO `i18` VALUES (832, 'userInfo.table.columnD', '类型', 2);
INSERT INTO `i18` VALUES (833, 'userInfo.week.1', '入职2周', 2);
INSERT INTO `i18` VALUES (834, 'userInfo.month.1', '入职1个月', 2);
INSERT INTO `i18` VALUES (835, 'userInfo.month.2', '入职2个月', 2);
INSERT INTO `i18` VALUES (836, 'userInfo.month.3', '入职3个月', 2);
INSERT INTO `i18` VALUES (837, 'userInfo.month.4', '入职4个月', 2);
INSERT INTO `i18` VALUES (838, 'userInfo.month.5', '入职5个月', 2);
INSERT INTO `i18` VALUES (839, 'userInfo.month.6', '入职6个月', 2);
INSERT INTO `i18` VALUES (840, 'userInfo.month.7', '入职7个月', 2);
INSERT INTO `i18` VALUES (841, 'userInfo.month.8', '入职8个月', 2);
INSERT INTO `i18` VALUES (842, 'userInfo.month.9', '入职9个月', 2);
INSERT INTO `i18` VALUES (843, 'userInfo.month.10', '入职10个月', 2);
INSERT INTO `i18` VALUES (844, 'userInfo.month.11', '入职11个月', 2);
INSERT INTO `i18` VALUES (845, 'userInfo.month.12', '入职12个月', 2);
INSERT INTO `i18` VALUES (846, 'userInfo.month.13', '入职13个月', 2);
INSERT INTO `i18` VALUES (847, 'userInfo.month.14', '入职14个月', 2);
INSERT INTO `i18` VALUES (848, 'userInfo.month.15', '入职15个月', 2);
INSERT INTO `i18` VALUES (849, 'userInfo.month.16', '入职16个月', 2);
INSERT INTO `i18` VALUES (850, 'userInfo.month.17', '入职17个月', 2);
INSERT INTO `i18` VALUES (851, 'userInfo.time.message', '结束时间小于开始时间', 2);
INSERT INTO `i18` VALUES (852, 'userInfo.filter.all', '请完善当前所有筛选条件', 2);
INSERT INTO `i18` VALUES (853, 'menu.user.setting', '用户设置', 2);
INSERT INTO `i18` VALUES (854, 'userSetting.save', '保存', 2);
INSERT INTO `i18` VALUES (855, 'userSetting.cancel', '取消', 2);
INSERT INTO `i18` VALUES (856, 'userSetting.department', '所属部门:', 2);
INSERT INTO `i18` VALUES (857, 'userSetting.position', '职位:', 2);
INSERT INTO `i18` VALUES (858, 'userSetting.type', '招聘类型:', 2);
INSERT INTO `i18` VALUES (859, 'userSetting.date', '试用起止日期:', 2);
INSERT INTO `i18` VALUES (860, 'userSetting.during', '试用期时长:', 2);
INSERT INTO `i18` VALUES (861, 'userSetting.startTime', '劳动合同开始日期:', 2);
INSERT INTO `i18` VALUES (862, 'userSetting.endTime', '劳动合同结束日期:', 2);
INSERT INTO `i18` VALUES (863, 'userSetting.first', '开始时间', 2);
INSERT INTO `i18` VALUES (864, 'userSetting.last', '结束时间', 2);
INSERT INTO `i18` VALUES (865, 'menu.plan.department', '培养部门', 2);
INSERT INTO `i18` VALUES (866, 'menu.plan.resource', '人力资源管理部', 2);
INSERT INTO `i18` VALUES (867, 'menu.plan.job', '职级', 2);
INSERT INTO `i18` VALUES (868, 'menu.plan.person', '人员类型', 2);
INSERT INTO `i18` VALUES (869, 'menu.plan.attribute', '业务属性', 2);
INSERT INTO `i18` VALUES (870, 'menu.plan.develop', '是否需制定', 2);
INSERT INTO `i18` VALUES (871, 'menu.plan.yes', '是', 2);
INSERT INTO `i18` VALUES (872, 'menu.plan.no', '否', 2);
INSERT INTO `i18` VALUES (873, 'menu.plan.role', '制定角色', 2);
INSERT INTO `i18` VALUES (874, 'menu.plan.mentor', '导师', 2);
INSERT INTO `i18` VALUES (875, 'menu.plan.condition', '生效条件', 2);
INSERT INTO `i18` VALUES (876, 'menu.plan.approval', '直接主管审批', 2);
INSERT INTO `i18` VALUES (877, 'menu.plan.frequency', '制定频次', 2);
INSERT INTO `i18` VALUES (878, 'menu.plan.month', '按月', 2);
INSERT INTO `i18` VALUES (879, 'menu.plan.goal', '目标制定角色', 2);
INSERT INTO `i18` VALUES (880, 'menu.plan.trainees', '学员', 2);
INSERT INTO `i18` VALUES (881, 'menu.plan.teacher', '导师审批', 2);
INSERT INTO `i18` VALUES (882, 'menu.plan.phase', '阶段评价', 2);
INSERT INTO `i18` VALUES (883, 'menu.plan.evaluation', '需导师、直接主管评价', 2);
INSERT INTO `i18` VALUES (884, 'menu.plan.whole', '整体评价', 2);
INSERT INTO `i18` VALUES (885, 'menu.plan.pool', '是否仅从导师资源池选择导师', 2);
INSERT INTO `i18` VALUES (886, 'menu.plan.time', '更新时间', 2);
INSERT INTO `i18` VALUES (887, 'menu.plan.version', '版本号', 2);
INSERT INTO `i18` VALUES (888, 'menu.plan.operation', '操作', 2);
INSERT INTO `i18` VALUES (889, 'menu.plan.updated', '更新人', 2);
INSERT INTO `i18` VALUES (890, 'work.mock.employees', '转岗员工', 2);
INSERT INTO `i18` VALUES (891, 'work.mock.onboard', '新员工上岗', 2);
INSERT INTO `i18` VALUES (892, 'work.mock.Test', '测试辅导', 2);
INSERT INTO `i18` VALUES (893, 'work.mock.week1', '零促实践(1周)', 2);
INSERT INTO `i18` VALUES (894, 'work.mock.week2', '零促实践(2周)', 2);
INSERT INTO `i18` VALUES (895, 'work.mock.week3', '零促实践(3周)', 2);
INSERT INTO `i18` VALUES (896, 'work.mock.network', '网络实践', 2);
INSERT INTO `i18` VALUES (897, 'work.mock.collectValue1', '制度学习视频课', 2);
INSERT INTO `i18` VALUES (898, 'work.mock.collectDescription1', '将考勤、晋升等制度转换为互动式视频课，快速了解，审批流程（如请假申请，主管审批，HR备案）', 2);
INSERT INTO `i18` VALUES (899, 'work.mock.collectHotLabel1', '热门', 2);
INSERT INTO `i18` VALUES (900, 'work.mock.collectLabel2', '请假申请流程模板', 2);
INSERT INTO `i18` VALUES (901, 'work.mock.collectValue2', '如何成为业务导师经典课程回顾', 2);
INSERT INTO `i18` VALUES (902, 'work.mock.collectDescription2', '按技能矩阵匹配领域专家，通过任务看板实时跟踪指导进展', 2);
INSERT INTO `i18` VALUES (903, 'work.mock.collectLabel3', '制定个人发展IDP', 2);
INSERT INTO `i18` VALUES (904, 'work.mock.collectValue3', '学员练习册', 2);
INSERT INTO `i18` VALUES (905, 'work.mock.collectDescription3', '构建同期新人PK榜单，按学习进度，任务完成度生成“成长力指数”排名', 2);
INSERT INTO `i18` VALUES (906, 'work.mock.collectLabel4', '经验共享积分池', 2);
INSERT INTO `i18` VALUES (907, 'work.mock.collectValue4', '教师网课平台', 2);
INSERT INTO `i18` VALUES (908, 'work.mock.collectDescription4', '技能训练、协作支持与动态反馈机制，构建全生命周期成长体系', 2);
INSERT INTO `i18` VALUES (909, 'work.mock.collectLabel5', '“认知-实训-实战”三阶模型', 2);
INSERT INTO `i18` VALUES (910, 'work.mock.centralized', '新员工集中培训', 2);
INSERT INTO `i18` VALUES (911, 'work.mock.hardware', '硬装实践', 2);
INSERT INTO `i18` VALUES (912, 'work.index.learn', '学习规划', 2);
INSERT INTO `i18` VALUES (913, 'work.index.coach', '学习辅导', 2);
INSERT INTO `i18` VALUES (914, 'work.index.formalization', '常见问题', 2);
INSERT INTO `i18` VALUES (915, 'work.index.collect', '相关收藏功能', 2);
INSERT INTO `i18` VALUES (916, 'work.index.practiced', '学习实践', 2);
INSERT INTO `i18` VALUES (917, 'work.index.train', '学习集训', 2);
INSERT INTO `i18` VALUES (918, 'work.index.Inquiry', '生活小助手', 2);
INSERT INTO `i18` VALUES (919, 'work.index.Home', '新员工之家', 2);
INSERT INTO `i18` VALUES (920, 'work.index.Guide', '操作指导', 2);
INSERT INTO `i18` VALUES (921, 'work.index.plans', '待制定/确认计划数', 2);
INSERT INTO `i18` VALUES (922, 'work.index.Unfinished', '未完成', 2);
INSERT INTO `i18` VALUES (923, 'work.index.beOverdue', '即将逾期数', 2);
INSERT INTO `i18` VALUES (924, 'work.index.Overdue', '已逾期', 2);
INSERT INTO `i18` VALUES (925, 'work.index.trainees', '待启动辅导学员数', 2);
INSERT INTO `i18` VALUES (926, 'work.index.coachNum', '辅导中学员数', 2);
INSERT INTO `i18` VALUES (927, 'work.index.allocated', '待分配学员数', 2);
INSERT INTO `i18` VALUES (928, 'work.index.start', '待启动实践学员数', 2);
INSERT INTO `i18` VALUES (929, 'work.index.practice', '实践中学员数', 2);
INSERT INTO `i18` VALUES (930, 'work.index.unpark', '待启动转正', 2);
INSERT INTO `i18` VALUES (931, 'work.index.entered', '待录入评价结果', 2);
INSERT INTO `i18` VALUES (932, 'work.index.approved', '待审批评价结果', 2);
INSERT INTO `i18` VALUES (933, 'work.index.put', '实践中学员数', 2);
INSERT INTO `i18` VALUES (934, 'work.index.assign', '待分配学员数', 2);
INSERT INTO `i18` VALUES (935, 'work.index.prepare', '准备开班班级', 2);
INSERT INTO `i18` VALUES (936, 'work.index.open', '开班中班班级', 2);
INSERT INTO `i18` VALUES (937, 'work.index.classes', '待验收班级数', 2);
INSERT INTO `i18` VALUES (938, 'work.index.policy', '政策', 2);
INSERT INTO `i18` VALUES (939, 'work.index.Period', '新员工试用期及培养政策流程', 2);
INSERT INTO `i18` VALUES (940, 'work.index.Hotline', '热线', 2);
INSERT INTO `i18` VALUES (941, 'work.index.service', '各类实用热线服', 2);
INSERT INTO `i18` VALUES (942, 'work.index.Attendance', '考勤', 2);
INSERT INTO `i18` VALUES (943, 'work.index.FAQs', '考勤制度及常见问题答疑', 2);
INSERT INTO `i18` VALUES (944, 'work.index.Payroll', '发薪', 2);
INSERT INTO `i18` VALUES (945, 'work.index.Tax', '发薪纳税问答', 2);
INSERT INTO `i18` VALUES (946, 'work.index.Brave', '员工如何提升专业技能和职业能力', 2);
INSERT INTO `i18` VALUES (947, 'work.index.Growth', '文章更新', 2);
INSERT INTO `i18` VALUES (948, 'work.index.Termbase', '勇敢新世纪登录计划', 2);
INSERT INTO `i18` VALUES (949, 'work.index.lingo', '最新最热术语，助您懂行话', 2);
INSERT INTO `i18` VALUES (950, 'work.index.Library', '新员工福利须知', 2);
INSERT INTO `i18` VALUES (951, 'work.index.domain', '业务领域知识文档库', 2);
INSERT INTO `i18` VALUES (952, 'work.index.platform', '在线学习平台', 2);
INSERT INTO `i18` VALUES (953, 'work.index.learning', '在线学习', 2);
INSERT INTO `i18` VALUES (954, 'work.index.Operation', '新员工之家操作指导', 2);
INSERT INTO `i18` VALUES (955, 'work.index.Numbers', '个', 2);
INSERT INTO `i18` VALUES (956, 'work.index.Person', '人', 2);
INSERT INTO `i18` VALUES (957, 'work.index.net', '网络', 2);
INSERT INTO `i18` VALUES (958, 'work.index.questions1', '如何在员工论坛发表文章？', 2);
INSERT INTO `i18` VALUES (959, 'work.index.questions2', '登录失败怎么解决？', 2);
INSERT INTO `i18` VALUES (960, 'work.index.questions3', '无法登录员工之家平台怎么办？', 2);
INSERT INTO `i18` VALUES (961, 'work.index.questions4', '文档库与社区欢迎您', 2);
INSERT INTO `i18` VALUES (962, 'work.index.questions5', '无法登录网课服务平台怎么办？', 2);
INSERT INTO `i18` VALUES (963, 'work.index.questions6', '如何创建新项目工单？', 2);
INSERT INTO `i18` VALUES (964, 'work.index.netonline', '在线咨询', 2);
INSERT INTO `i18` VALUES (965, 'home.main.one', '首屏可见', 2);
INSERT INTO `i18` VALUES (966, 'home.main.up', '页面Onload', 2);
INSERT INTO `i18` VALUES (967, 'home.main.down', '采样PV', 2);
INSERT INTO `i18` VALUES (968, 'home.main.day', '较昨日', 2);
INSERT INTO `i18` VALUES (969, 'home.curve.trend', '性能趋势', 2);
INSERT INTO `i18` VALUES (970, 'home.curve.play', '首屏可见', 2);
INSERT INTO `i18` VALUES (971, 'home.curve.page', '页面Onload', 2);
INSERT INTO `i18` VALUES (972, 'home.falls.line', '加载瀑布流', 2);
INSERT INTO `i18` VALUES (973, 'home.falls.tcp', 'TCP链接', 2);
INSERT INTO `i18` VALUES (974, 'home.falls.ssl', 'SSL链接', 2);
INSERT INTO `i18` VALUES (975, 'home.round.title', '网络速度分布', 2);
INSERT INTO `i18` VALUES (976, 'home.round.unknow', '未知', 2);
INSERT INTO `i18` VALUES (977, 'home.roundtable.index', '序号', 2);
INSERT INTO `i18` VALUES (978, 'home.roundtable.space', '网络速度', 2);
INSERT INTO `i18` VALUES (979, 'home.roundtable.pv', '采样PV(占比)', 2);
INSERT INTO `i18` VALUES (980, 'home.roundtable.play', '首屏可见', 2);
INSERT INTO `i18` VALUES (981, 'home.roundtable.page', '页面Onload', 2);
INSERT INTO `i18` VALUES (982, 'home.region.title', '地域分布', 2);
INSERT INTO `i18` VALUES (983, 'menu.cloud.hello', 'Hello World', 2);
INSERT INTO `i18` VALUES (984, 'menu.cloud.contracts', '合同管理', 2);
INSERT INTO `i18` VALUES (985, 'menu.cloud.create', '创建合同', 2);
INSERT INTO `i18` VALUES (986, 'menu.cloud.edit', '编辑合同', 2);
INSERT INTO `i18` VALUES (987, 'menu.cloud.del', '删除合同', 2);
INSERT INTO `i18` VALUES (988, 'menu.cloud.name', '项目名称:', 2);
INSERT INTO `i18` VALUES (989, 'menu.cloud.id', '合同编号', 2);
INSERT INTO `i18` VALUES (990, 'menu.cloud.customer', '客户名称:', 2);
INSERT INTO `i18` VALUES (991, 'menu.cloud.description', '项目描述:', 2);
INSERT INTO `i18` VALUES (992, 'menu.cloud.updatedAt', '创建时间', 2);
INSERT INTO `i18` VALUES (993, 'menu.cloud.editOpa', '编辑', 2);
INSERT INTO `i18` VALUES (994, 'menu.cloud.editDel', '删除', 2);
INSERT INTO `i18` VALUES (995, 'menu.cloud.registerErro', '项目名称不满足校验规则', 2);
INSERT INTO `i18` VALUES (996, 'menu.cloud.sure', '确认', 2);
INSERT INTO `i18` VALUES (997, 'menu.cloud.cancel', '取消', 2);
INSERT INTO `i18` VALUES (998, 'menu.cloud.tip', '支持汉字、英文、数字、中划线、下划线、点、斜杠、中英文格式下的小括号和冒号、中文格式下的顿号，且只能以英文、汉字和数字开头，3-255个字符。', 2);
INSERT INTO `i18` VALUES (999, 'menu.cloud.askDel', '您确定要删除以下', 2);
INSERT INTO `i18` VALUES (1000, 'menu.cloud.askContracts', '合同', 2);
INSERT INTO `i18` VALUES (1001, 'menu.cloud.askInput', '输入', 2);
INSERT INTO `i18` VALUES (1002, 'menu.cloud.askSure', '确认', 2);
INSERT INTO `i18` VALUES (1003, 'menu.cloud.verification', '校验不通过', 2);
INSERT INTO `i18` VALUES (1004, 'menu.cloud.editpass', '校验通过, 修改成功', 2);
INSERT INTO `i18` VALUES (1005, 'menu.cloud.delpass', '删除成功', 2);
INSERT INTO `i18` VALUES (1006, 'menu.contracts.name', '合同名称为:', 2);
INSERT INTO `i18` VALUES (1007, 'http.error.TokenExpire', '登录过期，请重新登录', 2);
INSERT INTO `i18` VALUES (1008, 'http.error.UserNotFound', '用户不存在', 2);
INSERT INTO `i18` VALUES (1009, 'http.error.UserAlreadyExist', '用户已存在', 2);
INSERT INTO `i18` VALUES (1010, 'http.error.InvalidParameter', '无效的请求参数', 2);
INSERT INTO `i18` VALUES (1011, 'http.error.InternalError', '服务器错误', 2);
INSERT INTO `i18` VALUES (1012, 'http.error.ErrorPassword', '账号或密码错误', 2);
INSERT INTO `i18` VALUES (1013, 'menu.allUser.info', '查看用户', 2);
INSERT INTO `i18` VALUES (1014, 'userInfo.table.id', 'ID', 2);
INSERT INTO `i18` VALUES (1015, 'userInfo.table.name', '名称', 2);
INSERT INTO `i18` VALUES (1016, 'userInfo.table.email', '邮箱', 2);
INSERT INTO `i18` VALUES (1017, 'userInfo.table.department', '部门', 2);
INSERT INTO `i18` VALUES (1018, 'userInfo.table.employeeType', '招聘类型', 2);
INSERT INTO `i18` VALUES (1019, 'userInfo.table.socialRecruitment', '社会招聘', 2);
INSERT INTO `i18` VALUES (1020, 'userInfo.table.schoolRecruitment', '校园招聘', 2);
INSERT INTO `i18` VALUES (1021, 'userInfo.table.jobTransfer', '转岗', 2);
INSERT INTO `i18` VALUES (1022, 'userInfo.table.job', '职位', 2);
INSERT INTO `i18` VALUES (1023, 'userInfo.table.probation', '试用期', 2);
INSERT INTO `i18` VALUES (1024, 'userInfo.table.probationStart', '试用期开始日期', 2);
INSERT INTO `i18` VALUES (1025, 'userInfo.table.probationEnd', '试用期结束日期', 2);
INSERT INTO `i18` VALUES (1026, 'userInfo.table.probationDuration', '试用期时长', 2);
INSERT INTO `i18` VALUES (1027, 'userInfo.table.protocol', '劳动合同', 2);
INSERT INTO `i18` VALUES (1028, 'userInfo.table.protocolStart', '劳动合同开始日期', 2);
INSERT INTO `i18` VALUES (1029, 'userInfo.table.protocolEnd', '劳动合同结束日期', 2);
INSERT INTO `i18` VALUES (1030, 'userInfo.table.address', '地址', 2);
INSERT INTO `i18` VALUES (1031, 'userInfo.table.status', '状态', 2);
INSERT INTO `i18` VALUES (1032, 'userInfo.table.import', '导入', 2);
INSERT INTO `i18` VALUES (1033, 'userInfo.table.export', '导出', 2);
INSERT INTO `i18` VALUES (1034, 'userInfo.table.activeStatus', '正常', 2);
INSERT INTO `i18` VALUES (1035, 'userInfo.table.disabledStatus', '已禁用', 2);
INSERT INTO `i18` VALUES (1036, 'userInfo.table.createTime', '创建时间', 2);
INSERT INTO `i18` VALUES (1037, 'userInfo.table.updateTime', '更新时间', 2);
INSERT INTO `i18` VALUES (1038, 'userInfo.table.operations', '操作', 2);
INSERT INTO `i18` VALUES (1039, 'userInfo.table.updateTable', '修改表格', 2);
INSERT INTO `i18` VALUES (1040, 'userInfo.table.operations.update', '修改', 2);
INSERT INTO `i18` VALUES (1041, 'userInfo.table.operations.delete', '删除', 2);
INSERT INTO `i18` VALUES (1042, 'userInfo.table.operations.pwdUpdate', '密码', 2);
INSERT INTO `i18` VALUES (1043, 'userInfo.day', '天', 2);
INSERT INTO `i18` VALUES (1044, 'userInfo.modal.title.pwdUpdate', '修改密码', 2);
INSERT INTO `i18` VALUES (1045, 'userInfo.modal.input.oldPassword', '旧密码', 2);
INSERT INTO `i18` VALUES (1046, 'userInfo.modal.input.newPassword', '新密码', 2);
INSERT INTO `i18` VALUES (1047, 'userInfo.modal.input.confirmNewPassword', '确认新密码', 2);
INSERT INTO `i18` VALUES (1048, 'userInfo.modal.message.error', '确认新密码错误', 2);
INSERT INTO `i18` VALUES (1049, 'userInfo.modal.message.notNull', '密码不能为空', 2);
INSERT INTO `i18` VALUES (1050, 'userInfo.modal.title.add', '添加用户', 2);
INSERT INTO `i18` VALUES (1051, 'userInfo.modal.title.update', '更新用户', 2);
INSERT INTO `i18` VALUES (1052, 'menu.allUser.setting', '用户设置', 2);
INSERT INTO `i18` VALUES (1053, 'userSetting.name', '用户名', 2);
INSERT INTO `i18` VALUES (1054, 'userSetting.address', '地址', 2);
INSERT INTO `i18` VALUES (1055, 'userSetting.status', '状态', 2);
INSERT INTO `i18` VALUES (1056, 'menu.allUser.useradd', '添加用户', 2);
INSERT INTO `i18` VALUES (1057, 'userAdd.save', '提交', 2);
INSERT INTO `i18` VALUES (1058, 'userAdd.cancel', '取消', 2);
INSERT INTO `i18` VALUES (1059, 'userAdd.email', '邮箱', 2);
INSERT INTO `i18` VALUES (1060, 'userAdd.password', '密码', 2);
INSERT INTO `i18` VALUES (1061, 'userAdd.department', '所属部门:', 2);
INSERT INTO `i18` VALUES (1062, 'userAdd.position', '职位:', 2);
INSERT INTO `i18` VALUES (1063, 'userAdd.type', '招聘类型:', 2);
INSERT INTO `i18` VALUES (1064, 'userAdd.date', '试用起止日期:', 2);
INSERT INTO `i18` VALUES (1065, 'userAdd.during', '试用期时长:', 2);
INSERT INTO `i18` VALUES (1066, 'userAdd.startTime', '劳动合同开始日期:', 2);
INSERT INTO `i18` VALUES (1067, 'userAdd.endTime', '劳动合同结束日期:', 2);
INSERT INTO `i18` VALUES (1068, 'userAdd.first', '开始时间', 2);
INSERT INTO `i18` VALUES (1069, 'userAdd.last', '结束时间', 2);
INSERT INTO `i18` VALUES (1070, 'userAdd.name', '用户名', 2);
INSERT INTO `i18` VALUES (1071, 'userAdd.address', '地址', 2);
INSERT INTO `i18` VALUES (1072, 'userAdd.status', '状态', 2);
INSERT INTO `i18` VALUES (1073, 'menu.allPermission.info', '查看权限', 2);
INSERT INTO `i18` VALUES (1074, 'permissionInfo.add.success', '添加权限成功', 2);
INSERT INTO `i18` VALUES (1075, 'permissionInfo.edit.success', '修改成功', 2);
INSERT INTO `i18` VALUES (1076, 'permissionInfo.table.id', 'ID', 2);
INSERT INTO `i18` VALUES (1077, 'permissionInfo.table.name', '名称', 2);
INSERT INTO `i18` VALUES (1078, 'permissionInfo.table.desc', '权限描述', 2);
INSERT INTO `i18` VALUES (1079, 'permissionInfo.table.operations', '操作', 2);
INSERT INTO `i18` VALUES (1080, 'permissionInfo.table.operations.update', '修改', 2);
INSERT INTO `i18` VALUES (1081, 'permissionInfo.table.operations.delete', '删除', 2);
INSERT INTO `i18` VALUES (1082, 'permissionInfo.modal.title.update', '修改权限', 2);
INSERT INTO `i18` VALUES (1083, 'permissionInfo.modal.title.add', '添加权限', 2);
INSERT INTO `i18` VALUES (1084, 'permissionInfo.modal.input.permission', '权限描述', 2);
INSERT INTO `i18` VALUES (1085, 'permissionInfo.modal.input.name', '权限名称', 2);
INSERT INTO `i18` VALUES (1086, 'permissionInfo.modal.input.id', 'id', 2);
INSERT INTO `i18` VALUES (1087, 'permissionInfo.modal.message.error', '错误', 2);
INSERT INTO `i18` VALUES (1088, 'permissionInfo.modal.message.notNull', '不能为空', 2);
INSERT INTO `i18` VALUES (1089, 'menu.allRole.info', '查看权限', 2);
INSERT INTO `i18` VALUES (1090, 'roleInfo.table.id', 'ID', 2);
INSERT INTO `i18` VALUES (1091, 'roleInfo.table.name', '名称', 2);
INSERT INTO `i18` VALUES (1092, 'roleInfo.table.desc', '权限', 2);
INSERT INTO `i18` VALUES (1093, 'roleInfo.table.menu', '菜单', 2);
INSERT INTO `i18` VALUES (1094, 'roleInfo.table.operations', '操作', 2);
INSERT INTO `i18` VALUES (1095, 'roleInfo.table.operations.update', '修改', 2);
INSERT INTO `i18` VALUES (1096, 'roleInfo.table.operations.delete', '删除', 2);
INSERT INTO `i18` VALUES (1097, 'roleInfo.modal.title.update', '修改角色', 2);
INSERT INTO `i18` VALUES (1098, 'roleInfo.modal.title.add', '添加角色', 2);
INSERT INTO `i18` VALUES (1099, 'roleInfo.modal.add.success', '添加角色成功', 2);
INSERT INTO `i18` VALUES (1100, 'roleInfo.modal.input.id', 'ID', 2);
INSERT INTO `i18` VALUES (1101, 'roleInfo.modal.input.name', '名称', 2);
INSERT INTO `i18` VALUES (1102, 'roleInfo.modal.input.desc', '权限', 2);
INSERT INTO `i18` VALUES (1103, 'roleInfo.modal.input.menu', '菜单', 2);
INSERT INTO `i18` VALUES (1104, 'roleInfo.modal.message.error', '错误', 2);
INSERT INTO `i18` VALUES (1105, 'roleInfo.modal.message.notNull', '不能为空', 2);
INSERT INTO `i18` VALUES (1106, 'roleInfo.permissionTable.id', 'ID', 2);
INSERT INTO `i18` VALUES (1107, 'roleInfo.permissionTable.name', '权限名称', 2);
INSERT INTO `i18` VALUES (1108, 'roleInfo.permissionTable.desc', '权限介绍', 2);
INSERT INTO `i18` VALUES (1109, 'roleInfo.menuUpdate.confirm', '确认修改', 2);
INSERT INTO `i18` VALUES (1110, 'roleInfo.menuUpdate.cancel', '取消', 2);
INSERT INTO `i18` VALUES (1111, 'roleInfo.table.bind', '绑定目录', 2);
INSERT INTO `i18` VALUES (1112, 'menu.allMenu.info', '查看菜单', 2);
INSERT INTO `i18` VALUES (1113, 'menuInfo.table.id', 'ID', 2);
INSERT INTO `i18` VALUES (1114, 'menuInfo.table.name', '名称', 2);
INSERT INTO `i18` VALUES (1115, 'menuInfo.table.order', '优先级', 2);
INSERT INTO `i18` VALUES (1116, 'menuInfo.table.parentId', '父菜单ID', 2);
INSERT INTO `i18` VALUES (1117, 'menuInfo.table.menuType', '菜单类型', 2);
INSERT INTO `i18` VALUES (1118, 'menuInfo.table.icon', '图标', 2);
INSERT INTO `i18` VALUES (1119, 'menuInfo.table.component', '组件', 2);
INSERT INTO `i18` VALUES (1120, 'menuInfo.table.path', '路径', 2);
INSERT INTO `i18` VALUES (1121, 'menuInfo.table.locale', '国际化', 2);
INSERT INTO `i18` VALUES (1122, 'menuInfo.table.operations', '操作', 2);
INSERT INTO `i18` VALUES (1123, 'menuInfo.table.operations.info', '查看', 2);
INSERT INTO `i18` VALUES (1124, 'menuInfo.table.operations.update', '修改', 2);
INSERT INTO `i18` VALUES (1125, 'menuInfo.table.operations.delete', '删除', 2);
INSERT INTO `i18` VALUES (1126, 'menuInfo.modal.add.success', '创建菜单成功', 2);
INSERT INTO `i18` VALUES (1127, 'menuInfo.modal.edit.success', '数据已修改成功', 2);
INSERT INTO `i18` VALUES (1128, 'menuInfo.modal.title.confirm', '你确认要删除该数据吗？', 2);
INSERT INTO `i18` VALUES (1129, 'menuInfo.modal.title.info', '查看菜单', 2);
INSERT INTO `i18` VALUES (1130, 'menuInfo.modal.title.update', '修改菜单', 2);
INSERT INTO `i18` VALUES (1131, 'menuInfo.modal.title.add', '创建菜单', 2);
INSERT INTO `i18` VALUES (1132, 'menuInfo.modal.message.error', 'parentId不能和id相同', 2);
INSERT INTO `i18` VALUES (1133, 'menuInfo.modal.message.notNull', '不能为空', 2);
INSERT INTO `i18` VALUES (1134, 'menuInfo.modal.tips.upd-id', '修改菜单ID前, 请确保前端工程师知晓此事!', 2);
INSERT INTO `i18` VALUES (1135, 'menu.add.demo', '菜单Demo页', 2);
INSERT INTO `i18` VALUES (1136, 'menu.add.placeholder', '请输入关键字进行搜索', 2);
INSERT INTO `i18` VALUES (1137, 'exception.result.demo.description', '这是一个新增的菜单demo页', 2);
INSERT INTO `i18` VALUES (1138, 'locale.add.btn', '添加词条', 2);
INSERT INTO `i18` VALUES (1139, 'locale.add.title', '添加词条', 2);
INSERT INTO `i18` VALUES (1140, 'locale.add.key', '词条关键字', 2);
INSERT INTO `i18` VALUES (1141, 'locale.add.content', '词条内容', 2);
INSERT INTO `i18` VALUES (1142, 'locale.add.lang', '词条语言', 2);
INSERT INTO `i18` VALUES (1143, 'lang.add.title', '语言名称', 2);
INSERT INTO `i18` VALUES (1144, 'lang.add.btn', '确认', 2);
INSERT INTO `i18` VALUES (1145, 'lang.manage.btn', '管理语言', 2);
INSERT INTO `i18` VALUES (1146, 'locale.add.lang.btn', '新增语言', 2);
INSERT INTO `i18` VALUES (1147, 'lang.manage.title', '管理语言', 2);
INSERT INTO `i18` VALUES (1148, 'lang.manage.remove', '删除', 2);
INSERT INTO `i18` VALUES (1149, 'locale.remove', '删除', 2);
INSERT INTO `i18` VALUES (1150, 'locale.batchRemove', '批量删除', 2);
INSERT INTO `i18` VALUES (1151, 'component.error', '组件错误', 2);
INSERT INTO `i18` VALUES (1152, 'component.error.contact', '请联系管理员或重新登录', 2);

-- ----------------------------
-- Table structure for lang
-- ----------------------------
DROP TABLE IF EXISTS `lang`;
CREATE TABLE `lang`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lang
-- ----------------------------
INSERT INTO `lang` VALUES (1, 'enUS');
INSERT INTO `lang` VALUES (2, 'zhCN');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order` int NOT NULL,
  `parentId` int NULL DEFAULT NULL,
  `menuType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `locale` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, 'Board', 1, NULL, 'normal', 'IconApplication', 'board/index', 'board', 'menu.board');
INSERT INTO `menu` VALUES (2, 'Home', 1, 1, 'normal', '', 'board/home/index', 'home', 'menu.home');
INSERT INTO `menu` VALUES (3, 'Work', 2, 1, 'normal', '', 'board/work/index', 'work', 'menu.work');
INSERT INTO `menu` VALUES (4, 'List', 2, NULL, 'normal', 'IconFiles', 'list/index', 'list', 'menu.list');
INSERT INTO `menu` VALUES (5, 'Table', 1, 4, 'normal', '', 'list/search-table/index', 'table', 'menu.list.searchTable');
INSERT INTO `menu` VALUES (6, 'Form', 3, NULL, 'normal', 'IconSetting', 'form/index', 'form', 'menu.form');
INSERT INTO `menu` VALUES (7, 'Base', 1, 6, 'normal', '', 'form/base/index', 'base', 'menu.form.base');
INSERT INTO `menu` VALUES (8, 'Step', 2, 6, 'normal', '', 'form/step/index', 'step', 'menu.form.step');
INSERT INTO `menu` VALUES (9, 'Profile', 4, NULL, 'normal', 'IconFiletext', 'profile/index', 'profile', 'menu.profile');
INSERT INTO `menu` VALUES (10, 'Detail', 1, 9, 'normal', '', 'profile/detail/index', 'detail', 'menu.profile.detail');
INSERT INTO `menu` VALUES (11, 'Result', 5, NULL, 'normal', 'IconSuccessful', 'result/index', 'result', 'menu.result');
INSERT INTO `menu` VALUES (12, 'Success', 1, 11, 'normal', '', 'result/success/index', 'success', 'menu.result.success');
INSERT INTO `menu` VALUES (13, 'Error', 2, 11, 'normal', '', 'result/error/index', 'error', 'menu.result.error');
INSERT INTO `menu` VALUES (14, 'Exception', 6, NULL, 'normal', 'IconCueL', 'exception/index', 'exception', 'menu.exception');
INSERT INTO `menu` VALUES (15, '403', 1, 14, 'normal', '', 'exception/403/index', '403', 'menu.exception.403');
INSERT INTO `menu` VALUES (16, '404', 2, 14, 'normal', '', 'exception/404/index', '404', 'menu.exception.404');
INSERT INTO `menu` VALUES (17, '500', 1, 14, 'normal', '', 'exception/500/index', '500', 'menu.exception.500');
INSERT INTO `menu` VALUES (18, 'User', 7, NULL, 'normal', 'IconUser', 'user/index', 'user', 'menu.user');
INSERT INTO `menu` VALUES (19, 'Info', 1, 18, 'normal', '', 'user/info/index', 'info', 'menu.user.info');
INSERT INTO `menu` VALUES (20, 'MenuPage', 9, NULL, 'normal', 'IconApp', 'menu/index', 'menuPage', 'menu.menuPage');
INSERT INTO `menu` VALUES (21, 'SecondMenu', 1, 20, 'normal', '', 'menu/index', 'secondMenu', 'menu.menuPage.second');
INSERT INTO `menu` VALUES (22, 'ThirdMenu', 1, 21, 'normal', '', 'menu/demo/index', 'thirdMenu', 'menu.menuPage.third');
INSERT INTO `menu` VALUES (23, 'SystemManager', 10, NULL, 'normal', 'IconTotal', 'menu/index', '', 'menu.systemManager');
INSERT INTO `menu` VALUES (24, 'AllMenu', 1, 23, 'admin', 'IconGrade', 'menu/info/index', 'menu/allMenu', 'menu.menu.info');
INSERT INTO `menu` VALUES (25, 'AllPermission', 1, 23, 'admin', 'IconFolderOpened', 'permission/info/index', 'permission/allPermission', 'menu.permission.info');
INSERT INTO `menu` VALUES (26, 'AllRole', 1, 23, 'admin', 'IconActivation', 'role/info/index', 'role/allRole', 'menu.role.info');
INSERT INTO `menu` VALUES (27, 'AllInfo', 1, 23, 'admin', 'IconGroup', 'userManager/info/index', 'userManager/allInfo', 'menu.userManager.info');
INSERT INTO `menu` VALUES (28, 'Local', 14, 23, '', 'IconFlag', 'locale/index', 'locale', 'menu.i18n');
INSERT INTO `menu` VALUES (29, 'Card', 2, 4, 'normal', '', 'list/card-list/index', 'card', 'menu.list.cardList');
INSERT INTO `menu` VALUES (30, 'Advance', 3, 6, 'normal', '', 'form/advance/index', 'advance', 'menu.form.advance');

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, 1751959540200, 'TinyPro1751959540200');
INSERT INTO `migrations` VALUES (2, 1764502806240, 'TinyPro1764502806240');

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES (1, 'super permission', '*');
INSERT INTO `permission` VALUES (2, '', 'user::add');
INSERT INTO `permission` VALUES (3, '', 'user::update');
INSERT INTO `permission` VALUES (4, '', 'role::add');
INSERT INTO `permission` VALUES (5, '', 'user::remove');
INSERT INTO `permission` VALUES (6, '', 'role::update');
INSERT INTO `permission` VALUES (7, '', 'user::query');
INSERT INTO `permission` VALUES (8, '', 'role::remove');
INSERT INTO `permission` VALUES (9, '', 'role::query');
INSERT INTO `permission` VALUES (10, '', 'user::password::force-update');
INSERT INTO `permission` VALUES (11, '', 'menu::update');
INSERT INTO `permission` VALUES (12, '', 'menu::add');
INSERT INTO `permission` VALUES (13, '', 'user::batch-remove');
INSERT INTO `permission` VALUES (14, '', 'menu::query');
INSERT INTO `permission` VALUES (15, '', 'i18n::add');
INSERT INTO `permission` VALUES (16, '', 'menu::remove');
INSERT INTO `permission` VALUES (17, '', 'permission::update');
INSERT INTO `permission` VALUES (18, '', 'lang::update');
INSERT INTO `permission` VALUES (19, '', 'permission::remove');
INSERT INTO `permission` VALUES (20, '', 'i18n::update');
INSERT INTO `permission` VALUES (21, '', 'i18n::remove');
INSERT INTO `permission` VALUES (22, '', 'permission::get');
INSERT INTO `permission` VALUES (23, '', 'i18n::query');
INSERT INTO `permission` VALUES (24, '', 'i18n::batch-remove');
INSERT INTO `permission` VALUES (25, '', 'lang::query');
INSERT INTO `permission` VALUES (26, '', 'lang::add');
INSERT INTO `permission` VALUES (27, '', 'permission::add');
INSERT INTO `permission` VALUES (28, '', 'lang::remove');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'admin');

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `roleId` int NOT NULL,
  `menuId` int NOT NULL,
  PRIMARY KEY (`roleId`, `menuId`) USING BTREE,
  INDEX `IDX_4a57845f090fb832eeac3e3486`(`roleId` ASC) USING BTREE,
  INDEX `IDX_ed7dbf72cc845b0c9150a67851`(`menuId` ASC) USING BTREE,
  CONSTRAINT `FK_4a57845f090fb832eeac3e34860` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ed7dbf72cc845b0c9150a678512` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES (1, 1);
INSERT INTO `role_menu` VALUES (1, 2);
INSERT INTO `role_menu` VALUES (1, 3);
INSERT INTO `role_menu` VALUES (1, 4);
INSERT INTO `role_menu` VALUES (1, 5);
INSERT INTO `role_menu` VALUES (1, 6);
INSERT INTO `role_menu` VALUES (1, 7);
INSERT INTO `role_menu` VALUES (1, 8);
INSERT INTO `role_menu` VALUES (1, 9);
INSERT INTO `role_menu` VALUES (1, 10);
INSERT INTO `role_menu` VALUES (1, 11);
INSERT INTO `role_menu` VALUES (1, 12);
INSERT INTO `role_menu` VALUES (1, 13);
INSERT INTO `role_menu` VALUES (1, 14);
INSERT INTO `role_menu` VALUES (1, 15);
INSERT INTO `role_menu` VALUES (1, 16);
INSERT INTO `role_menu` VALUES (1, 17);
INSERT INTO `role_menu` VALUES (1, 18);
INSERT INTO `role_menu` VALUES (1, 19);
INSERT INTO `role_menu` VALUES (1, 20);
INSERT INTO `role_menu` VALUES (1, 21);
INSERT INTO `role_menu` VALUES (1, 22);
INSERT INTO `role_menu` VALUES (1, 23);
INSERT INTO `role_menu` VALUES (1, 24);
INSERT INTO `role_menu` VALUES (1, 25);
INSERT INTO `role_menu` VALUES (1, 26);
INSERT INTO `role_menu` VALUES (1, 27);
INSERT INTO `role_menu` VALUES (1, 28);
INSERT INTO `role_menu` VALUES (1, 29);
INSERT INTO `role_menu` VALUES (1, 30);

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission`  (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`roleId`, `permissionId`) USING BTREE,
  INDEX `IDX_e3130a39c1e4a740d044e68573`(`roleId` ASC) USING BTREE,
  INDEX `IDX_72e80be86cab0e93e67ed1a7a9`(`permissionId` ASC) USING BTREE,
  CONSTRAINT `FK_72e80be86cab0e93e67ed1a7a9a` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_e3130a39c1e4a740d044e685730` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission` VALUES (1, 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `department` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `employeeType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `probationStart` timestamp NULL DEFAULT NULL,
  `probationEnd` timestamp NULL DEFAULT NULL,
  `probationDuration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `protocolStart` timestamp NULL DEFAULT NULL,
  `protocolEnd` timestamp NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updateTime` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `create_time` timestamp NOT NULL DEFAULT current_timestamp,
  `salt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_time` timestamp NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'admin@no-reply.com', '054eaf3e99f70086035ad15f65681756d515', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-27 19:44:20.720737', '2026-03-27 19:44:20.720737', '2026-03-27 19:44:20', 'cH5/AQ==', '2026-03-27 19:44:20');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`, `roleId`) USING BTREE,
  INDEX `IDX_ab40a6f0cd7d3ebfcce082131f`(`userId` ASC) USING BTREE,
  INDEX `IDX_dba55ed826ef26b5b22bd39409`(`roleId` ASC) USING BTREE,
  CONSTRAINT `FK_ab40a6f0cd7d3ebfcce082131fd` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_dba55ed826ef26b5b22bd39409b` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 1);

SET FOREIGN_KEY_CHECKS = 1;
