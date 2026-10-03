
(function(){
    'use strict';

    function syncFrozenHeaders(){
        document.querySelectorAll('.brightlife-public-page, .public-membership-page').forEach(function(page){
            var header = page.querySelector(':scope > .public-main-header');
            if(!header) return;

            var height = Math.ceil(header.getBoundingClientRect().height);
            page.style.setProperty('--public-header-height', height + 'px');
            page.classList.add('public-header-reserved');
        });
    }

    function initFrozenHeaders(){
        syncFrozenHeaders();

        if(window.ResizeObserver){
            document.querySelectorAll('.brightlife-public-page, .public-membership-page').forEach(function(page){
                var header = page.querySelector(':scope > .public-main-header');
                if(!header) return;
                var observer = new ResizeObserver(function(){
                    var height = Math.ceil(header.getBoundingClientRect().height);
                    page.style.setProperty('--public-header-height', height + 'px');
                });
                observer.observe(header);
            });
        }

        window.addEventListener('resize', syncFrozenHeaders, {passive:true});
        window.addEventListener('orientationchange', syncFrozenHeaders, {passive:true});
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', initFrozenHeaders);
    }else{
        initFrozenHeaders();
    }

    
    var container=document.getElementById('publicHomeContent');
    if(container && window.MutationObserver){
        var observer=new MutationObserver(function(){
            window.requestAnimationFrame(syncFrozenHeaders);
        });
        observer.observe(container,{childList:true,subtree:true});
    }
})();



window.BRIGHTLIFE_BUILD = 'BRIGHTLIFE-PROFESSIONAL-PUBLIC-PORTAL-2026-09-23';
        var isActive = false;
        window.isActive = false;
        let currentUser = null;
        let currentPage = 'dashboard';
        let pendingCount = 0;
        let messageCount = 0;
        let chatCount = 0;
        let resetOtpSent = false;
        let resetOtpBusy = false;
        function showConfirmDialog(title, message, type, onConfirm, confirmText) {
            const existing = document.querySelector('.confirm-dialog');
            if (existing) existing.remove();

            const icons = {
                warning: { class: '', icon: 'fa-exclamation-triangle' },
                danger: { class: 'danger', icon: 'fa-exclamation-circle' },
                success: { class: 'success', icon: 'fa-check-circle' },
                info: { class: '', icon: 'fa-info-circle' }
            };

            const iconData = icons[type] || icons.warning;
            const confirmBtnClass = type === 'danger' ? 'danger' : type === 'success' ? 'success' : '';
            const btnText = confirmText || (type === 'danger' ? 'Yes, Proceed' : 'Yes, Confirm');

            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                    <div class="dialog-box">
                        <div class="dialog-icon ${iconData.class}">
                            <i class="fas ${iconData.icon}"></i>
                        </div>
                        <div class="dialog-title">${title}</div>
                        <div class="dialog-message">${message}</div>
                        <div class="dialog-actions">
                            <button class="btn-cancel" onclick="this.closest('.confirm-dialog').remove()">Cancel</button>
                            <button class="btn-confirm ${confirmBtnClass}" id="confirmBtn">${btnText}</button>
                        </div>
                    </div>
                `;

            document.body.appendChild(dialog);

            document.getElementById('confirmBtn').addEventListener('click', function() {
                dialog.remove();
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
            });

            dialog.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.remove();
                }
            });

            document.addEventListener('keydown', function handler(e) {
                if (e.key === 'Escape') {
                    const d = document.querySelector('.confirm-dialog');
                    if (d) {
                        d.remove();
                        document.removeEventListener('keydown', handler);
                    }
                }
            });
        }
        function showToast(message, type) {
            const existing = document.querySelector('.toast-notification');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'toast-notification';

            const colors = {
                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#6C3CE1'
            };

            toast.style.background = colors[type] || colors.info;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(function() {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(function() { toast.remove(); }, 300);
            }, 3000);
        }
        function confirmLogout() {
            showConfirmDialog(
                'Logout Confirmation',
                'Are you sure you want to logout from your account?',
                'warning',
                function() {
                    logout();
                },
                'Yes, Logout'
            );
        }
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            const darkToggle = document.getElementById('darkModeToggle');
            if (darkToggle) darkToggle.checked = isDark;
        }

        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
        function workspaceIsMobile() { return window.matchMedia('(max-width: 768px)').matches; }
        function syncWorkspaceLayout() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const main = document.getElementById('mainWrapper');
            const toggleBtn = document.getElementById('mobileMenuToggle');
            if (!sidebar || !main) return;
            const mobile = workspaceIsMobile();
            const visible = sidebar.classList.contains('visible');
            if (mobile) {
                main.classList.remove('with-sidebar','expanded');
                if (toggleBtn) toggleBtn.classList.toggle('hidden', !visible);
                if (!visible) {
                    sidebar.classList.remove('open');
                    if (overlay) overlay.classList.remove('show');
                }
            } else {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('show');
                if (visible) main.classList.add('with-sidebar');
                else main.classList.remove('with-sidebar');
                if (toggleBtn) toggleBtn.classList.add('hidden');
            }
        }
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const main = document.getElementById('mainWrapper');
            const overlay = document.getElementById('sidebarOverlay');
            if (!sidebar || !main) return;
            if (workspaceIsMobile()) {
                const willOpen = !sidebar.classList.contains('open');
                sidebar.classList.toggle('open', willOpen);
                if (overlay) overlay.classList.toggle('show', willOpen);
                return;
            }
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded', sidebar.classList.contains('collapsed'));
        }
        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (!sidebar) return;
            const willOpen = !sidebar.classList.contains('open');
            sidebar.classList.toggle('open', willOpen);
            if (overlay) overlay.classList.toggle('show', willOpen);
        }
        window.addEventListener('resize', syncWorkspaceLayout);
        function ensureAuthenticatedWorkspaceNavigation() {
            var sidebar = document.getElementById('sidebar');
            var main = document.getElementById('mainWrapper');
            var dashboard = document.getElementById('dashboard');
            var secureSection = document.getElementById('secureMemberSection');
            var toggleBtn = document.getElementById('mobileMenuToggle');
            if (!sidebar || !main || !dashboard || !getCanonicalMemberId()) return false;
            document.body.classList.remove('public-site-body');
            document.documentElement.classList.remove('public-site-html');
            document.body.classList.add('workspace-active');
            if (secureSection) secureSection.style.display = 'block';
            sidebar.classList.add('visible');
            sidebar.removeAttribute('aria-hidden');
            sidebar.style.setProperty('display','flex','important');
            sidebar.style.setProperty('visibility','visible','important');
            sidebar.style.setProperty('opacity','1','important');
            sidebar.style.setProperty('pointer-events','auto','important');
            var mobile = workspaceIsMobile();
            if (mobile) {
                main.classList.remove('with-sidebar','expanded');
                main.style.removeProperty('margin-left');
                main.style.removeProperty('width');
                main.style.removeProperty('max-width');
                if (toggleBtn) toggleBtn.classList.remove('hidden');
                if (!sidebar.classList.contains('open')) sidebar.style.setProperty('transform','translateX(-105%)','important');
            } else {
                sidebar.classList.remove('open');
                sidebar.style.setProperty('transform','translateX(0)','important');
                main.classList.add('with-sidebar');
                main.style.setProperty('margin-left','272px','important');
                main.style.setProperty('width','calc(100% - 272px)','important');
                main.style.setProperty('max-width','calc(100% - 272px)','important');
                if (toggleBtn) toggleBtn.classList.add('hidden');
            }
            return true;
        }

        function showSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;
            sidebar.classList.add('visible');
            document.body.classList.add('workspace-active');
            syncWorkspaceLayout();
            ensureAuthenticatedWorkspaceNavigation();
        }
        function hideSidebar() {
            const sidebar = document.getElementById('sidebar');
            const main = document.getElementById('mainWrapper');
            const overlay = document.getElementById('sidebarOverlay');
            const toggleBtn = document.getElementById('mobileMenuToggle');
            if (sidebar) sidebar.classList.remove('visible','open','collapsed');
            document.body.classList.remove('workspace-active');
            if (main) main.classList.remove('with-sidebar','expanded');
            if (overlay) overlay.classList.remove('show');
            if (toggleBtn) toggleBtn.classList.add('hidden');
        }
        function toggleNavGroup(groupId, trigger){
            var group = document.getElementById(groupId);
            if (!group) return;
            var children = group.querySelector('.hierarchy-children');
            var currentlyExpanded = trigger && trigger.getAttribute('aria-expanded') === 'true';
            var nextExpanded = !currentlyExpanded;

            if (children) {
                children.style.display = nextExpanded ? 'block' : 'none';
            }
            group.classList.toggle('collapsed', !nextExpanded);
            if (trigger) trigger.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
        }

function scrollPublicSection(sectionId, navKey){
    var section=document.getElementById(sectionId);
    if(!section){ navigateTo('home'); setTimeout(function(){ scrollPublicSection(sectionId,navKey); },80); return; }
    document.querySelectorAll('.public-top-link, .public-main-link').forEach(function(item){ var key=item.getAttribute('data-nav') || item.getAttribute('data-public-nav'); item.classList.toggle('active', key===navKey); });
    section.scrollIntoView({behavior:'smooth',block:'start'});
}

function navigateTo(page) {
            const securePages = ['dashboard','savings','loans','loanmanagement','guarantors','repayments','transactions','reports','profile','messages','settings','contentmanagement','adminsettings','admin','members','alltransactions','executive','chat','rights'];
            if (securePages.indexOf(page) !== -1 && !getCanonicalMemberId()) {
                openMemberLogin();
                return;
            }
            currentPage = page;
            try {
                var routeHash = '#' + page;
                if (location.hash !== routeHash) history.pushState({brightlife:'route',page:page}, '', routeHash);
            } catch (e) {}

            // Keep the standalone project renderer isolated from the member workspace.
            // When the user leaves a project page, hide it completely so it cannot sit
            // over or behind Savings, Loan Management, Transactions, etc.
            var projectPageEl = document.getElementById('publicProjectPage');
            var projectRoutes = [
                'project-water','project-poultry','project-agriculture',
                'project-bike-skills','project-education','project-entrepreneurship','project-women',
                'project-youth','project-community-development','project-other','trainings'
            ];
            var isProjectRoute = projectRoutes.indexOf(page) !== -1;
            if (projectPageEl && !isProjectRoute) {
                projectPageEl.style.display = 'none';
                projectPageEl.innerHTML = '';
            }

            // Public project/detail pages must replace the landing page, not render behind it.
            if(page !== 'projects'){
                var projectModeWrapper=document.getElementById('mainWrapper');
                if(projectModeWrapper)projectModeWrapper.classList.remove('public-projects-mode');
                var projectSidebar=document.getElementById('sidebar');
                var projectTopbar=document.getElementById('memberTopbar');
                var keepMemberWorkspace = !!getCanonicalMemberId() && (securePages.indexOf(page)!==-1 || isProjectRoute);
                if(projectSidebar){ projectSidebar.style.display = keepMemberWorkspace ? '' : 'none'; projectSidebar.removeAttribute('aria-hidden'); }
                if(projectTopbar){ projectTopbar.style.display=keepMemberWorkspace ? 'flex' : 'none'; projectTopbar.setAttribute('aria-hidden', keepMemberWorkspace ? 'false' : 'true'); }
            }
            if(page === 'projects') {
                var projectsDashboard=document.getElementById('dashboard');
                var projectsSidebar=document.getElementById('sidebar');
                var projectsTopbar=document.getElementById('memberTopbar');
                var projectsMember=!!getCanonicalMemberId();
                if(projectsDashboard) projectsDashboard.classList.toggle('brightlife-public-mode', !projectsMember);
                if(projectsMember){
                    document.body.classList.add('workspace-active');
                    if(projectsSidebar){ projectsSidebar.style.display='flex'; projectsSidebar.classList.add('visible'); projectsSidebar.removeAttribute('aria-hidden'); }
                    if(projectsTopbar){ projectsTopbar.style.display='flex'; projectsTopbar.setAttribute('aria-hidden','false'); }
                    var projectsMain=document.getElementById('mainWrapper');
                    if(projectsMain) projectsMain.classList.add('with-sidebar');
                    ensureAuthenticatedWorkspaceNavigation();
                } else {
                    if(projectsSidebar){ projectsSidebar.style.display='none'; projectsSidebar.classList.remove('visible','open'); projectsSidebar.setAttribute('aria-hidden','true'); }
                    if(projectsTopbar){ projectsTopbar.style.display='none'; projectsTopbar.setAttribute('aria-hidden','true'); }
                }
            }
            if(page !== 'home' && page !== 'projects'){
                var publicLanding = document.getElementById('publicHomeLanding');
                var dashboard = document.getElementById('dashboard');
                var app = document.getElementById('app');
                if(publicLanding) publicLanding.style.display = 'none';
                if(dashboard) { dashboard.style.display = 'block'; dashboard.classList.remove('brightlife-public-mode'); }
                if(app && page.indexOf('project-') === 0) app.style.display = 'none';
                var mw = document.getElementById('mainWrapper');
                if(mw && mw.classList) mw.classList.remove('public-site-mode');
            }
            var pageNames={dashboard:['Dashboard','Your secure member account'],savings:['Savings','Your savings and contributions'],loans:['Loans','Loan applications and status'],loanmanagement:['Loan Management','Manage your borrowing and repayment obligations'],guarantors:['Guarantors','Guarantee requests and history'],repayments:['Repayments','Your loan repayment records'],transactions:['My Transactions','Your personal transaction history'],reports:['My Statement','Your personal financial statement'],messages:['Messages','Secure member communication'],profile:['Profile','Manage your member profile'],settings:['Settings','Account preferences'],adminsettings:['Admin Settings','Organization controls and administrator access'],['project-water']:['Water Supply','Community project information and updates'],['project-poultry']:['Poultry','Community project information and updates'],['project-agriculture']:['Agriculture & Livelihoods','Community project information and updates'],['project-bike-skills']:['Bike Repair & Vocational Skills','Community project information and updates'],['project-education']:['Education Support','Community project information and updates'],['project-entrepreneurship']:['Entrepreneurship & Small Business','Community project information and updates'],['project-women']:['Women Empowerment','Community project information and updates'],['project-youth']:['Youth Empowerment','Community project information and updates'],['project-community-development']:['Community Development','Community project information and updates'],['project-other']:['Other Community Projects','Community project information and updates'],trainings:['Training','Training activities and learning updates']};
            if(pageNames[page]) setMemberTopbarPage(page,pageNames[page][0],pageNames[page][1]);
            const publicSidebar = document.getElementById('publicSidebarSection');
            const secureSection = document.getElementById('secureMemberSection');
            const isSecurePage = securePages.indexOf(page) !== -1;
            var hasMemberSession = !!getCanonicalMemberId();
            if (publicSidebar) publicSidebar.style.display = hasMemberSession ? 'none' : (isSecurePage ? 'none' : 'block');
            if (secureSection) secureSection.style.display = hasMemberSession ? 'block' : 'none';
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            const navItem = document.getElementById('nav-' + page);
            if (navItem) navItem.classList.add('active');
            var secureNavId = page === 'trainings' ? 'nav-trainings-secure' : ('nav-' + page + '-secure');
            var secureNavItem = document.getElementById(secureNavId);
            if (secureNavItem) secureNavItem.classList.add('active');

            // Keep the workspace menu open when a member selects Water, Poultry or Training.
            if (window.innerWidth <= 768 && !(isProjectRoute && hasMemberSession)) {
                var sb=document.getElementById('sidebar'), ov=document.getElementById('sidebarOverlay');
                if(sb) sb.classList.remove('open');
                if(ov) ov.classList.remove('show');
            } else if (window.innerWidth <= 768 && isProjectRoute && hasMemberSession) {
                var sb2=document.getElementById('sidebar'), ov2=document.getElementById('sidebarOverlay');
                if(sb2) { sb2.classList.add('visible','open'); sb2.style.display=''; }
                if(ov2) ov2.classList.add('show');
            }

            if (hasMemberSession) {
                ensureAuthenticatedWorkspaceNavigation();
            }

            switch (page) {
                case 'home':
                    loadPublicHomePage();
                    break;
                case 'contacts':
                    loadContactsPage();
                    break;
                case 'projects':
                    loadProjectsPage();
                    break;
                case 'tablebanking':
                    openMemberLogin();
                    break;
                case 'project-water':
                    showSelectedProjectUpdatesPage('Water Supply','water');
                    break;
                case 'project-poultry':
                    showSelectedProjectUpdatesPage('Poultry','poultry');
                    break;
                case 'project-agriculture':
                    showSelectedProjectUpdatesPage('Agriculture & Livelihoods','agriculture');
                    break;
                case 'project-bike-skills':
                    showSelectedProjectUpdatesPage('Bike Repair & Vocational Skills','bike_skills');
                    break;
                case 'project-education':
                    showSelectedProjectUpdatesPage('Education Support','education');
                    break;
                case 'project-entrepreneurship':
                    showSelectedProjectUpdatesPage('Entrepreneurship & Small Business','entrepreneurship');
                    break;
                case 'project-women':
                    showSelectedProjectUpdatesPage('Women Empowerment','women');
                    break;
                case 'project-youth':
                    showSelectedProjectUpdatesPage('Youth Empowerment','youth');
                    break;
                case 'project-community-development':
                    showSelectedProjectUpdatesPage('Community Development','community_development');
                    break;
                case 'project-other':
                    showSelectedProjectUpdatesPage('Other Community Projects','other');
                    break;
                case 'trainings':
                    showSelectedProjectUpdatesPage('Training & Capacity Building','training');
                    break;
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'savings':
                    loadSavingsPage();
                    break;
                case 'loans':
                    loadLoansOverviewPage();
                    break;
                case 'loanmanagement':
                    loadLoansPage();
                    break;
                case 'repayments':
                    loadRepaymentsPage();
                    break;
                case 'guarantors':
                    loadGuarantorRequestsPage();
                    break;
                case 'transactions':
                    loadTransactions();
                    break;
                case 'alltransactions':
                    loadAdminTransactions();
                    break;
                case 'dataimport':
                    loadDataImportPage();
                    break;
                case 'profile':
                    showBiodataModal();
                    break;
                case 'messages':
                    loadMessagesPage();
                    break;
                case 'contentmanagement':
                    loadContentManagementPage();
                    break;
                case 'admin':
                    loadAdminDashboard();
                    break;
                case 'rights':
                    loadRightsManagement();
                    break;
                case 'members':
                    loadMembersPage();
                    break;
                case 'reports':
                    loadReportsPage();
                    break;
                case 'executive':
                    loadExecutivePage();
                    break;
                case 'chat':
                    loadChatPage();
                    break;
                case 'settings':
                    showSettings();
                    break;
                case 'adminsettings':
                    loadAdminSettingsPage();
                    break;
                default:
                    loadDashboard();
            }
        }
        function showTab(tab) {
            var publicHome = document.getElementById('publicHomeLanding'); if (publicHome) publicHome.style.display = 'none';
            var auth = document.getElementById('app'); if (auth) auth.style.display = 'block';
            var dashboard = document.getElementById('dashboard'); if (dashboard) dashboard.style.display = 'none';
            var secureSection = document.getElementById('secureMemberSection'); if (secureSection) secureSection.style.display = 'none';
            hideSidebar();

            ['login', 'register', 'reset'].forEach(t => {
                const el = document.getElementById(t + 'Tab');
                if (el) el.classList.remove('active');
            });
            const tabEl = document.getElementById(tab + 'Tab');
            if (tabEl) tabEl.classList.add('active');
            var authMode=document.getElementById('app');
            if(authMode && authMode.classList){
                if(tab === 'register') authMode.classList.add('registration-mode');
                else authMode.classList.remove('registration-mode');
            }

            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            if (tab === 'login' || tab === 'register') {
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    if (btn.textContent.toLowerCase().includes(tab === 'login' ? 'sign in' : 'register')) btn.classList
                        .add('active');
                });
            }
            document.querySelectorAll('.alert').forEach(el => el.remove());
        }

        function showMessage(element, message, type) {
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle',
                warning: 'fas fa-exclamation-triangle'
            };
            const className = type === 'success' ? 'alert-success' :
                type === 'error' ? 'alert-error' :
                type === 'warning' ? 'alert-warning' : 'alert-info';
            element.innerHTML = '<div class="alert ' + className + '"><i class="' + icons[type] + '"></i><span>' + message +
                '</span></div>';
        }
        function clearServerReadCache() {
            if (window.SERVER_READ_CACHE) window.SERVER_READ_CACHE.clear();
        }

        const SERVER_READ_CACHE = new Map();
        const SERVER_READ_INFLIGHT = new Map();
        const SERVER_READ_TTL = 20000;
        const CACHEABLE_SERVER_CALLS = new Set([
            'getMemberProfile', 'getSettings', 'getLoanGrowthSettings', 'checkActiveLoanGrowthMethod',
            'getDashboardStats', 'getTransactionSummaryForAdmin'
        ]);

        

        function callServer(funcName, params, options) {
            options = options || {};

            var safeParams = Object.assign({}, params || {});

            var actorId =
                typeof getCanonicalMemberId === 'function'
                    ? getCanonicalMemberId()
                    : '';

            var sessionToken =
                sessionStorage.getItem('brightlifeSessionToken') || '';

            var publicCalls = {
                loginMember: true,
                registerMember: true,
                requestPasswordReset: true,
                resetPasswordWithOtp: true,
                healthCheck: true
            };

            if (!publicCalls[funcName] && actorId && !safeParams.actorId) {
                safeParams.actorId = actorId;
            }

            if (!publicCalls[funcName] && sessionToken) {
                safeParams.sessionToken = sessionToken;
            }

            var isRead = CACHEABLE_SERVER_CALLS.has(funcName);

            var cacheParams = Object.assign({}, safeParams);
            delete cacheParams.sessionToken;

            var cacheKey =
                isRead
                    ? funcName + '|' + JSON.stringify(cacheParams)
                    : '';

            if (isRead && !options.force) {
                var cached = SERVER_READ_CACHE.get(cacheKey);

                if (
                    cached &&
                    (Date.now() - cached.time) < SERVER_READ_TTL
                ) {
                    return Promise.resolve(cached.value);
                }
            }

            function remember(result) {
                if (
                    isRead &&
                    result &&
                    result.success !== false
                ) {
                    SERVER_READ_CACHE.set(cacheKey,{time:Date.now(),value:result});
                } else if (!isRead) {
                    SERVER_READ_CACHE.clear();
                }
                return result;
            }

            if (isRead && !options.force && SERVER_READ_INFLIGHT.has(cacheKey)) {
                return SERVER_READ_INFLIGHT.get(cacheKey);
            }

            var requestPromise = fetch('/api/server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    functionName: funcName,
                    params: safeParams
                })
            })
            .then(function(response) {
                return response.text().then(function(text) {
                    var result = null;

                    try {
                        result = text ? JSON.parse(text) : null;
                    } catch (error) {
                        throw new Error(
                            'The Brightlife server returned an invalid response.'
                        );
                    }

                    if (!response.ok) {
                        throw new Error(
                            (result && (result.message || result.error)) ||
                            'The Brightlife server could not complete the request.'
                        );
                    }

                    return remember(result);
                });
            })
            .catch(function(error) {
                if (error && error.message) throw error;
                throw new Error('The Brightlife server could not complete the request.');
            })
            .finally(function(){
                if (isRead) SERVER_READ_INFLIGHT.delete(cacheKey);
            });

            if (isRead) SERVER_READ_INFLIGHT.set(cacheKey, requestPromise);
            return requestPromise;
        }

        function getCanonicalMemberId() {
            return String(
                sessionStorage.getItem('memberUuid') ||
                sessionStorage.getItem('memberIdNumber') ||
                sessionStorage.getItem('memberUniqueId') ||
                sessionStorage.getItem('memberId') ||
                ''
            ).trim();
        }

        function setMemberSession(member) {
            if (!member) return;
            const idNumber = String(member.idNumber || '').trim();
            const memberCode = String(member.uniqueId || '').trim();
            if (idNumber) sessionStorage.setItem('memberIdNumber', idNumber);
            if (idNumber) sessionStorage.setItem('memberId', idNumber);
            if (memberCode) sessionStorage.setItem('memberUniqueId', memberCode);
            if (member.id) sessionStorage.setItem('memberUuid', String(member.id));
        }
        function cacheMemberSession_(member) {
            if (!member) return;
            const phone = String(member.phoneNumber || member.phone_number || '').trim();
            if (phone) sessionStorage.setItem('phoneNumber', phone);
        }

        async function refreshAccountAccess_() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return null;
            const result = await callServer('getAccountAccess', {memberId: memberId}, {force:true});
            if (!result || !result.success || !result.member) throw new Error((result && result.message) || 'Unable to verify account access.');
            const m = result.member;
            sessionStorage.setItem('memberUuid', m.id || memberId);
            sessionStorage.setItem('memberIdNumber', m.idNumber || sessionStorage.getItem('memberIdNumber') || '');
            sessionStorage.setItem('memberId', m.idNumber || sessionStorage.getItem('memberId') || memberId);
            sessionStorage.setItem('memberUniqueId', m.uniqueId || sessionStorage.getItem('memberUniqueId') || '');
            sessionStorage.setItem('memberName', m.name || sessionStorage.getItem('memberName') || 'Member');
            if (m.phoneNumber || m.phone_number) sessionStorage.setItem('phoneNumber', m.phoneNumber || m.phone_number);
            sessionStorage.setItem('memberRole', m.role || 'member');
            sessionStorage.setItem('isActive', String(m.isActive === true));
            sessionStorage.setItem('permissions', JSON.stringify(m.permissions || {}));
            currentUser = Object.assign({}, currentUser || {}, {id:m.id,idNumber:m.idNumber,uniqueId:m.uniqueId,name:m.name,phoneNumber:m.phoneNumber || m.phone_number || sessionStorage.getItem('phoneNumber') || '',role:m.role,isActive:m.isActive,permissions:m.permissions});
            cacheMemberSession_(currentUser);
            updateUserInfo(currentUser);
            return result;
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.remove();
        }

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.parentElement.querySelector('.toggle-password i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        }
        function setElementDisplaySafe(id, display) {
    var el = document.getElementById(id);
    if (el) el.style.display = display;
}

function updateUserInfo(member) {
            if (member) {
                const nameParts = member.name.split(' ');
                const initials = nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
                document.getElementById('userAvatar').textContent = initials;
                document.getElementById('userName').textContent = member.name;
                const roleDisplay = member.role === 'super_admin' ? '👑 Super Admin' :
                    member.role === 'admin' ? '👑 Administrator' :
                    member.role === 'treasurer' ? '💰 Treasurer' :
                    member.role === 'customer_care' ? '💬 Customer Care' :
                    member.role === 'profile_approver' ? '📝 In-charge / Profile Approver' : 'Member';
                document.getElementById('userRole').textContent = roleDisplay;
                updateMemberTopbar(member);

                const permissions = member.permissions || {};
                const isAdmin = member.role === 'admin' || member.role === 'super_admin';
                const accountActive = member.isActive === true || member.isActive === 'true' || member.is_active === true || member.is_active === 'true';
                isActive = accountActive;
                window.isActive = isActive;

                const hasAdminAccess = isAdmin || permissions.view_members ||
                    permissions.loan_approval || permissions.savings_approval ||
                    permissions.withdrawal_approval || permissions.registration_approval ||
                    permissions.grant_rights || permissions.customer_care || permissions.view_reports ||
                    permissions.profile_approval || permissions.view_savings || permissions.data_import ||
                    permissions.edit_members || permissions.view_repayments || permissions.view_transactions;
                const hasManagementDashboard = isAdmin || member.role === 'treasurer' || member.role === 'customer_care' || member.role === 'profile_approver' || permissions.view_reports || permissions.view_members || permissions.loan_approval || permissions.savings_approval || permissions.withdrawal_approval || permissions.registration_approval || permissions.grant_rights || permissions.customer_care || permissions.profile_approval || permissions.data_import || permissions.edit_members || permissions.view_repayments || permissions.view_transactions;

                const adminSection = document.getElementById('adminSection');
                if (adminSection) adminSection.style.display = hasAdminAccess ? 'block' : 'none';

                setElementDisplaySafe('nav-admin', hasManagementDashboard ? 'flex' : 'none');
                const canManageWebsite = (member.role === 'admin' || member.role === 'super_admin');
                if (document.getElementById('nav-contentmanagement')) setElementDisplaySafe('nav-contentmanagement', canManageWebsite ? 'flex' : 'none');
                if (document.getElementById('nav-admin-water')) setElementDisplaySafe('nav-admin-water', canManageWebsite ? 'flex' : 'none');
                if (document.getElementById('nav-admin-poultry')) setElementDisplaySafe('nav-admin-poultry', canManageWebsite ? 'flex' : 'none');
                if (document.getElementById('nav-admin-training')) setElementDisplaySafe('nav-admin-training', canManageWebsite ? 'flex' : 'none');
                if (document.getElementById('nav-adminsettings-main')) setElementDisplaySafe('nav-adminsettings-main', canManageWebsite ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin', isAdmin ? 'flex' : (hasManagementDashboard ? 'flex' : 'none'));
                setElementDisplaySafe('nav-executive', isAdmin || permissions.view_reports ? 'flex' : 'none');
                setElementDisplaySafe('nav-rights', isAdmin || permissions.grant_rights ? 'flex' : 'none');
                setElementDisplaySafe('nav-members', isAdmin || permissions.view_members ? 'flex' : 'none');
                setElementDisplaySafe('nav-alltransactions', isAdmin || permissions.view_transactions ? 'flex' : 'none');
                setElementDisplaySafe('nav-chat', isAdmin || permissions.customer_care ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-profile', isAdmin ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-repayments', isAdmin || permissions.view_repayments ? 'flex' : 'none');
                const canApprove = isAdmin || permissions.registration_approval || permissions.savings_approval || permissions.loan_approval || permissions.withdrawal_approval || permissions.profile_approval;
                if (document.getElementById('nav-approvals')) setElementDisplaySafe('nav-approvals', 'none');
                setElementDisplaySafe('nav-executive', (member.role === 'super_admin' || member.role === 'admin' || permissions.view_reports) ? 'flex' : 'none');
                setElementDisplaySafe('nav-rights', (isAdmin || permissions.grant_rights) ? 'flex' : 'none');
                setElementDisplaySafe('nav-members', (isAdmin || permissions.view_members) ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-reports', 'flex');
                setElementDisplaySafe('nav-executive', (isAdmin || permissions.view_reports) ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-repayments', (isAdmin || permissions.view_repayments) ? 'flex' : 'none');
                setElementDisplaySafe('nav-guarantors', (member.role === 'member' && accountActive) ? 'flex' : 'none');
                if (!isAdmin && member.role === 'member' && accountActive) loadGuarantorRequests();
                setElementDisplaySafe('nav-chat', (isAdmin || permissions.customer_care) ? 'flex' : 'none');
                setElementDisplaySafe('nav-alltransactions', (isAdmin || permissions.view_transactions) ? 'flex' : 'none');
                setElementDisplaySafe('nav-dataimport', (member.role === 'super_admin' || (member.role === 'admin' && permissions.data_import === true)) ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-profile', isAdmin ? 'flex' : 'none');
                if (document.getElementById('nav-adminsettings-main')) setElementDisplaySafe('nav-adminsettings-main', (member.role === 'super_admin' || member.role === 'admin') ? 'flex' : 'none');
                setElementDisplaySafe('nav-settings', 'flex');

                showSidebar();
                currentUser = member;
            cacheMemberSession_(currentUser);
            } else {
                document.getElementById('userAvatar').textContent = 'G';
                document.getElementById('userName').textContent = 'Guest';
                document.getElementById('userRole').textContent = 'Not Logged In';
                setElementDisplaySafe('adminSection', 'none');
                setElementDisplaySafe('nav-settings', 'none');
                setElementDisplaySafe('nav-chat', 'none');
                if (document.getElementById('nav-approvals')) setElementDisplaySafe('nav-approvals', 'none');
                setElementDisplaySafe('nav-alltransactions', 'none');
                setElementDisplaySafe('nav-dataimport', 'none');
                setElementDisplaySafe('nav-guarantors', 'none');
                setElementDisplaySafe('nav-admin-profile', 'none');
                if (document.getElementById('nav-approvals')) setElementDisplaySafe('nav-approvals', 'none');
                if (document.getElementById('nav-adminsettings-main')) setElementDisplaySafe('nav-adminsettings-main', 'none');
                if (document.getElementById('nav-admin-water')) setElementDisplaySafe('nav-admin-water', 'none');
                if (document.getElementById('nav-admin-poultry')) setElementDisplaySafe('nav-admin-poultry', 'none');
                if (document.getElementById('nav-admin-training')) setElementDisplaySafe('nav-admin-training', 'none');
                hideSidebar();
                currentUser = null;
            }
        }
        async function registerUser(event) {
            event.preventDefault();
            const msg = document.getElementById('registerMessage');

            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(msg, 'A valid email address is required.', 'error');
                return;
            }

            if (password !== confirm) {
                showMessage(msg, 'Passwords do not match', 'error');
                return;
            }
            if (password.length < 8) {
                showMessage(msg, 'Password must be at least 8 characters', 'error');
                return;
            }

            const data = {
                fullName: document.getElementById('regName').value,
                idNumber: document.getElementById('regId').value,
                phoneNumber: document.getElementById('regPhone').value,
                email: email,
                password: password
            };

            try {
                showMessage(msg, 'Creating your account...', 'info');
                const result = await callServer('registerMember', data);
                if (result.success) {
                    showMessage(msg, '✅ ' + result.message + '<br><strong>Your Brightlife Member Code: ' + (result.memberId || 'CDO----') + '</strong><br><small>Keep this code safe for your records.</small>', 'success');

                    const loginResult = await callServer('loginMember', {
                        idNumber: data.idNumber,
                        password: password
                    });

                    if (loginResult.success) {
                        if (loginResult.sessionToken) sessionStorage.setItem('brightlifeSessionToken', loginResult.sessionToken);
                        sessionStorage.setItem('memberId', loginResult.member.idNumber || data.idNumber);
                        setMemberSession(loginResult.member);
                        sessionStorage.setItem('memberName', loginResult.member.name);
                        sessionStorage.setItem('memberUniqueId', loginResult.member.uniqueId || result.memberId || '');
                        sessionStorage.setItem('memberRole', loginResult.member.role || 'member');
                        isActive = loginResult.member.isActive === true || loginResult.member.isActive === 'true' || loginResult.member.is_active === true || loginResult.member.is_active === 'true';
                        sessionStorage.setItem('isActive', String(isActive));
                        sessionStorage.setItem('registrationFeePaid', loginResult.member.registrationFeePaid);
                        sessionStorage.setItem('registrationFeeStatus', loginResult.member.registrationFeeStatus ||
                            'pending');
                        sessionStorage.setItem('registrationFeeAmount', loginResult.member.registrationFeeAmount ||
                            0);
                        sessionStorage.setItem('biodataCompleted', loginResult.member.biodataCompleted);
                        sessionStorage.setItem('profileEditStatus', loginResult.member.profileEditStatus || 'pending');
                        sessionStorage.setItem('permissions', JSON.stringify(loginResult.member.permissions || {}));
                        try {
                            const accessResult = await refreshAccountAccess_();
                            if (accessResult && accessResult.member) loginResult.member = accessResult.member;
                        } catch (accessError) {
                            console.error('Account access refresh after registration failed:', accessError);
                        }
                        sessionStorage.setItem('loanLimit', loginResult.member.loanLimit || 5000);
                        sessionStorage.setItem('loanGrowthTier', loginResult.member.loanGrowthTier || 'basic');
                        sessionStorage.setItem('loanGrowthScore', loginResult.member.loanGrowthScore || 0);

                        document.getElementById('registerForm').reset();
                        updateUserInfo(loginResult.member);
                        showAuthenticatedShell(loginResult.member);
                        loadDashboard(true).catch(function(e){ console.error('Dashboard load after registration:',e); });
                    } else {
                        showMessage(msg, '✅ Registration successful! Please sign in.', 'success');
                        document.getElementById('registerForm').reset();
                        setTimeout(() => showTab('login'), 2000);
                    }
                } else {
                    showMessage(msg, result.message, 'error');
                }
            } catch (error) {
                showMessage(msg, 'Error: ' + error.message, 'error');
            }
        }

        function showAuthenticatedShell(member) {
            var publicHome = document.getElementById('publicHomeLanding'); if (publicHome) publicHome.style.display = 'none';
            var auth = document.getElementById('app'); if (auth) auth.style.display = 'none';

            const app=document.getElementById('app'), dashboard=document.getElementById('dashboard'), content=document.getElementById('dashboardContent');
            const memberTopbar=document.getElementById('memberTopbar');
            if(app) app.style.display='none';
            if(dashboard) dashboard.style.display='block';
            if(memberTopbar) memberTopbar.style.display='flex';
            if(content) content.innerHTML='<div class="dashboard-body"><div style="padding:32px;text-align:center"><div class="spinner" style="margin:0 auto 14px"></div><strong>Welcome, '+String((member&&member.name)||'Member').replace(/[<>&"']/g,'')+'</strong><div style="color:var(--gray-500);margin-top:6px">Loading your account…</div></div></div>';
            var publicSidebar=document.getElementById('publicSidebarSection'); if(publicSidebar) publicSidebar.style.display='none';
            var secureSection=document.getElementById('secureMemberSection'); if(secureSection) secureSection.style.display='block';
            ['nav-project-water-secure','nav-project-poultry-secure','nav-trainings-secure'].forEach(function(id){ var item=document.getElementById(id); if(item) item.style.display='flex'; });
            // Show and size the authenticated workspace sidebar immediately after login.
            // The page-reload/session-restore path already calls showSidebar(); the direct
            // login path must do the same or the sidebar area stays blank until Ctrl+F5.
            if (typeof showSidebar === 'function') showSidebar();
            if (typeof ensureAuthenticatedWorkspaceNavigation === 'function') ensureAuthenticatedWorkspaceNavigation();
            var adminSection=document.getElementById('adminSection');
            var role=String((member&&member.role)||'').toLowerCase();
            if(adminSection) adminSection.style.display=(role==='admin'||role==='super_admin'||role==='treasurer'||role==='customer_care'||role==='profile_approver')?'block':'none';
            updateUserInfo(member);
            updateMemberTopbar(member);
        }
        async function loginUser(event) {
            event.preventDefault();
            const msg = document.getElementById('loginMessage');

            const data = {
                idNumber: document.getElementById('loginId').value,
                password: document.getElementById('loginPassword').value
            };

            try {
                showMessage(msg, 'Signing in...', 'info');
                const result = await callServer('loginMember', data);
                if (!result) throw new Error('The server returned no login response. Please try again.');
                if (result.success) {
                    if (result.sessionToken) sessionStorage.setItem('brightlifeSessionToken', result.sessionToken);
                    sessionStorage.setItem('memberId', result.member.idNumber || data.idNumber);
                    setMemberSession(result.member);
                    currentUser = result.member;
            cacheMemberSession_(currentUser);
                    sessionStorage.setItem('memberName', result.member.name);
                    sessionStorage.setItem('memberRole', result.member.role || 'member');
                    isActive = result.member.isActive === true ||
                               result.member.isActive === 'true' ||
                               result.member.is_active === true ||
                               result.member.is_active === 'true';
                    window.isActive = isActive;
                    sessionStorage.setItem('isActive', String(isActive));
                    sessionStorage.setItem('registrationFeePaid', result.member.registrationFeePaid);
                    sessionStorage.setItem('registrationFeeStatus', result.member.registrationFeeStatus || 'pending');
                    sessionStorage.setItem('registrationFeeAmount', result.member.registrationFeeAmount || 0);
                    sessionStorage.setItem('biodataCompleted', result.member.biodataCompleted);
                    sessionStorage.setItem('profileEditStatus', result.member.profileEditStatus || 'pending');
                    sessionStorage.setItem('permissions', JSON.stringify(result.member.permissions || {}));
                    try {
                        const accessResult = await refreshAccountAccess_();
                        if (accessResult && accessResult.member) result.member = accessResult.member;
                    } catch (accessError) {
                        console.error('Account access refresh after login failed:', accessError);
                    }
                    sessionStorage.setItem('loanLimit', result.member.loanLimit || 5000);
                    sessionStorage.setItem('loanGrowthTier', result.member.loanGrowthTier || 'basic');
                    sessionStorage.setItem('loanGrowthScore', result.member.loanGrowthScore || 0);
                    try {
                        Object.keys(sessionStorage).forEach(function(k) {
                            if (k.indexOf('brightlife_dashboard_') === 0) sessionStorage.removeItem(k);
                        });
                    } catch (e) {}
                    updateUserInfo(result.member);
                    showAuthenticatedShell(result.member);
                    ensureAuthenticatedWorkspaceNavigation();
                    loadDashboard(true).then(function(){
                        ensureAuthenticatedWorkspaceNavigation();
                    }).catch(function(e){
                        console.error('Dashboard load after login:',e);
                        ensureAuthenticatedWorkspaceNavigation();
                    });
                    setTimeout(function(){
                        callServer('synchronizeMemberAccountAge',{memberId:result.member.idNumber,actorId:result.member.id},{force:true}).catch(function(){});
                    },50);
                    setTimeout(function(){ loadGuarantorRequests(); },250);
                } else {
                    showMessage(msg, result.message, 'error');
                }
            } catch (error) {
                const safeMessage = error && error.message ? error.message : 'Unable to sign in right now. Please check your connection and try again.';
                console.error('Login error:', error);
                showMessage(msg, 'Sign-in failed: ' + safeMessage, 'error');
            }
        }
        async function requestResetOtp() {
            const msg = document.getElementById('resetMessage');
            const btn = document.getElementById('sendResetOtpBtn');
            const idNumber = document.getElementById('resetId').value.trim();
            const email = document.getElementById('resetEmail').value.trim().toLowerCase();

            if (!idNumber || !email) {
                showMessage(msg, 'Enter your ID number and registered email first.', 'error');
                return;
            }

            if (resetOtpBusy) return;
            resetOtpBusy = true;
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
            }

            try {
                showMessage(msg, 'Sending secure OTP to your registered email...', 'info');
                const r = await callServer('requestPasswordReset', { idNumber: idNumber, email: email });

                if (!r) throw new Error('The server returned no response.');

                resetOtpSent = !!r.success;
                showMessage(msg, r.message || 'Unable to send OTP.', r.success ? 'success' : 'error');

                if (r.success) {
                    const otp = document.getElementById('resetOtp');
                    if (otp) {
                        otp.value = '';
                        otp.focus();
                    }
                }
            } catch (e) {
                resetOtpSent = false;
                console.error('Password reset OTP error:', e);
                showMessage(msg, 'Unable to send OTP: ' + (e && e.message ? e.message : String(e)), 'error');
            } finally {
                resetOtpBusy = false;
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
                }
            }
        }

        async function resetPasswordFunc(event) {
            event.preventDefault();
            const msg = document.getElementById('resetMessage');
            const idNumber = document.getElementById('resetId').value.trim();
            const otp = document.getElementById('resetOtp').value.trim();
            const newPassword = document.getElementById('resetNewPassword').value;
            const confirm = document.getElementById('resetConfirmPassword').value;
            if (!resetOtpSent) { showMessage(msg, 'Please click Send OTP and enter the OTP sent to your registered email.', 'error'); return; }
            if (!/^\d{6}$/.test(otp)) { showMessage(msg, 'Enter the 6-digit OTP sent to your email.', 'error'); return; }
            if (newPassword !== confirm) { showMessage(msg, 'Passwords do not match.', 'error'); return; }
            if (newPassword.length < 8) { showMessage(msg, 'Password must be at least 8 characters.', 'error'); return; }
            try {
                showMessage(msg, 'Verifying OTP and updating password...', 'info');
                const r = await callServer('resetPasswordWithOtp', {idNumber, otp, newPassword});
                if (r.success) { resetOtpSent = false; document.getElementById('resetForm').reset(); showMessage(msg, '✅ ' + r.message, 'success'); setTimeout(() => showTab('login'), 1800); }
                else showMessage(msg, r.message, 'error');
            } catch(e) { showMessage(msg, 'Unable to reset password: ' + e.message, 'error'); }
        }

        async function repairMemberSession() {
            try {
                const idNumber = (prompt('Enter your National ID number used to log in:') || '').trim();
                if (!idNumber) return;
                const result = await callServer('loginMember', {
                    idNumber: idNumber,
                    password: prompt('Enter your password:') || ''
                });
                if (!result || !result.success) {
                    showToast((result && result.message) || 'Could not repair session.', 'error');
                    return;
                }
                sessionStorage.setItem('memberIdNumber', result.member.idNumber);
                sessionStorage.setItem('memberId', result.member.idNumber);
                sessionStorage.setItem('memberUniqueId', result.member.uniqueId || '');
                sessionStorage.setItem('memberUuid', result.member.id || '');
                sessionStorage.setItem('memberName', result.member.name || '');
                sessionStorage.setItem('memberRole', result.member.role || 'member');
                sessionStorage.setItem('isActive', String(!!result.member.isActive));
                sessionStorage.setItem('registrationFeeStatus', result.member.registrationFeeStatus || 'pending');
                sessionStorage.setItem('biodataCompleted', String(!!result.member.biodataCompleted));
                sessionStorage.setItem('profileEditStatus', result.member.profileEditStatus || 'pending');
                sessionStorage.setItem('permissions', JSON.stringify(result.member.permissions || {}));
                loadDashboard(true);
            } catch (e) {
                showToast('Session repair failed: ' + e.message, 'error');
            }
        }
        function toggleProjectsNav(event){
            if(event) event.stopPropagation();
            const group=document.getElementById('projectsNavGroup');
            if(group) group.classList.toggle('open');
        }

        function renderPublicShell(kicker,title,subtitle,bodyHtml){
            const body=document.getElementById('dashboardContent');
            if(!body) return;
            body.innerHTML=`<div class="dashboard-body">
                <div class="page-header"><div><div class="site-kicker">${kicker}</div><h2>${title}</h2><p>${subtitle}</p></div></div>
                ${bodyHtml}
            </div>`;
        }

        async function getPublicContentMap(keys){
            try{
                const result=await callServer('getPublishedSiteContent',{keys:keys||[]},{force:true});
                if(!result || !result.success) return {};
                const map={};
                (result.items||[]).forEach(function(item){ map[item.content_key]=item; });
                return map;
            }catch(e){
                console.warn('Public content could not be loaded:',e);
                return {};
            }
        }

        function publicContentText(map,key,fallback){
            return map && map[key] ? String(map[key].body||fallback||'') : String(fallback||'');
        }

        function publicContentTitle(map,key,fallback){
            return map && map[key] ? String(map[key].title||fallback||'') : String(fallback||'');
        }

        function normalizePublicImageUrl(value){
            var url=String(value||'').trim();
            if(!/^https?:\/\//i.test(url)) return '';
            try{
                var parsed=new URL(url);
                var host=parsed.hostname.toLowerCase();
                // Convert common Google Drive share links into an image-serving URL.
                if(host==='drive.google.com' || host==='docs.google.com'){
                    var fileMatch=parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    var id=fileMatch&&fileMatch[1] ? fileMatch[1] : parsed.searchParams.get('id');
                    if(id) return 'https://drive.google.com/uc?export=view&id='+encodeURIComponent(id);
                }
                // Dropbox share URLs should use the raw-content host when possible.
                if(host==='www.dropbox.com' || host==='dropbox.com'){
                    parsed.hostname='dl.dropboxusercontent.com';
                    parsed.searchParams.delete('dl');
                    parsed.searchParams.delete('raw');
                    return parsed.toString();
                }
                return parsed.toString();
            }catch(e){ return ''; }
        }
        function publicContentImage(map,key){
            var url=map && map[key] ? String(map[key].image_url||'').trim() : '';
            return normalizePublicImageUrl(url);
        }

        
        var SND_PROJECT_DEFAULT_IMAGES={
            water:'project-images/water.jpg',
            poultry:'project-images/poultry.jpg',
            agriculture:'project-images/agriculture.jpg',
            bike_skills:'project-images/bike_skills.jpg',
            education:'project-images/education.jpg',
            entrepreneurship:'project-images/entrepreneurship.jpg',
            women:'project-images/women.jpg',
            youth:'project-images/youth.jpg',
            community_development:'project-images/community_development.jpg',
            other:'project-images/other.jpg'
        };
        function projectImageUrl(map,key){
            var managed=publicContentImage(map,key);
            return managed || SND_PROJECT_DEFAULT_IMAGES[key] || '';
        }

        function updateContentPhotoPreview(key){
            var input=document.getElementById('contentPhoto_'+key);
            var preview=document.getElementById('contentPhotoPreview_'+key);
            var message=document.getElementById('contentPhotoMessage_'+key);
            if(!input||!preview||!message)return;
            var entered=normalizePublicImageUrl(input.value);
            var url=entered || SND_PROJECT_DEFAULT_IMAGES[key] || '';
            preview.onload=function(){
                preview.style.display='block';
                message.textContent=entered ? 'Photo link works in preview.' : (SND_PROJECT_DEFAULT_IMAGES[key] ? 'Built-in project photo. Paste a new URL to replace it.' : 'Paste a direct photo link to preview it here.');
                message.style.color=entered?'#16803c':'#64748b';
            };
            preview.onerror=function(){
                preview.style.display='none';
                message.textContent=input.value.trim()?'Image could not be loaded. Use a direct, publicly accessible image URL.':'No default photo available. Paste a direct photo link to preview it here.';
                message.style.color=input.value.trim()?'#b45309':'#64748b';
            };
            if(url){preview.style.display='block';preview.src=url;}else{preview.removeAttribute('src');preview.style.display='none';message.textContent='Paste a direct photo link to preview it here.';message.style.color='#64748b';}
        }
        async function applyManagedHomepagePhotos(){
            try{
                var map=await getPublicContentMap(['home_hero','home_about','home_feature']);
                var targets=[
                    ['home_hero','#public-home .reference-hero'],
                    ['home_about','#public-home .reference-focus-section'],
                    ['home_feature','#public-home #public-projects']
                ];
                targets.forEach(function(pair){
                    var url=publicContentImage(map,pair[0]);
                    var target=document.querySelector(pair[1]);
                    if(!url||!target)return;
                    var gradient=pair[0]==='home_about'
                        ? 'linear-gradient(90deg,rgba(255,255,255,.96),rgba(255,255,255,.78))'
                        : 'linear-gradient(90deg,rgba(7,18,36,.88),rgba(7,18,36,.52))';
                    target.style.setProperty('background-image',gradient+',url("'+url.replace(/"/g,'%22')+'")','important');
                    target.style.setProperty('background-size','cover','important');
                    target.style.setProperty('background-position','center','important');
                });
            }catch(e){console.warn('Managed homepage photos could not be applied:',e);}
        }

        function toggleBrightlifeHomeMenu(event){
            if(event && event.stopPropagation) event.stopPropagation();
            var nav=document.getElementById('brightlifeHomeNav');
            var toggle=document.querySelector('.brightlife-menu-toggle');
            if(!nav) return;
            var open=nav.classList.toggle('is-open');
            if(toggle){
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                toggle.setAttribute('aria-label', open ? 'Close website menu' : 'Open website menu');
                var icon=toggle.querySelector('i');
                if(icon) icon.className=open ? 'fas fa-xmark' : 'fas fa-bars';
            }
        }
        function closeBrightlifeHomeMenu(){
            var nav=document.getElementById('brightlifeHomeNav');
            var toggle=document.querySelector('.brightlife-menu-toggle');
            if(nav) nav.classList.remove('is-open');
            if(toggle){
                toggle.setAttribute('aria-expanded','false');
                toggle.setAttribute('aria-label','Open website menu');
                var icon=toggle.querySelector('i');
                if(icon) icon.className='fas fa-bars';
            }
        }
        document.addEventListener('click', function(e){
            if(!e.target.closest('.brightlife-home-header')) closeBrightlifeHomeMenu();
        });


        function brightlifePublicHeader_(activePage){
            var items = [
                ['home','Home'], ['about','About'], ['programs','Programmes'],
                ['approach','Our Approach'], ['finance','Finance'], ['membership','Membership'],
                ['projects','Projects'], ['partner','Partner'], ['contact','Contact']
            ];
            var nav = items.map(function(item){
                var key=item[0], label=item[1];
                var action=key==='home' ? 'showPublicHome()' : (key==='projects' ? "navigateTo('projects')" : "showBrightlifeInnerPage('"+key+"')");
                var active=activePage===key ? ' class="active" aria-current="page"' : '';
                return '<button type="button"'+active+' onclick="closeBrightlifeInnerMenu();'+action+'">'+label+'</button>';
            }).join('');
            return `<header class="bl-inner-header"><div class="bl-inner-head"><button type="button" class="bl-brand" onclick="closeBrightlifeInnerMenu();showPublicHome()" aria-label="SND Brightlife CBO Home"><img src="https://i.ibb.co/Tx5GPpmN/Whats-App-Image-2026-09-04-at-09-51-28.jpg" alt="SND Brightlife CBO"><span><strong>SND Brightlife CBO</strong><small>Empowering People. Building Livelihoods. Transforming Communities.</small></span></button><button type="button" class="bl-inner-menu-toggle" aria-label="Open website menu" aria-expanded="false" onclick="toggleBrightlifeInnerMenu(event)"><i class="fas fa-bars"></i><span>Menu</span></button><nav id="brightlifeInnerNav" aria-label="Website navigation">${nav}<button type="button" class="bl-login" onclick="closeBrightlifeInnerMenu();openMemberLogin()">Member Login</button></nav></div></header>`;
        }

        function loadPublicHomePage(){
            document.body.classList.add('public-site-body');
            document.documentElement.classList.add('public-site-html');
            document.body.classList.remove('workspace-active');
            const body=document.getElementById('dashboardContent');
            if(!body) return;
            const publicSidebar=document.getElementById('publicSidebarSection');
            if(publicSidebar) publicSidebar.style.display='none';
            const memberTopbar=document.getElementById('memberTopbar');
            if(memberTopbar) memberTopbar.style.display='none';
            const sidebar=document.getElementById('sidebar');
            const main=document.getElementById('mainWrapper');
            const dashboard=document.getElementById('dashboard');
            if(sidebar){ sidebar.classList.remove('visible','open'); sidebar.style.display='none'; }
            if(main) main.classList.remove('with-sidebar');
            if(dashboard) dashboard.classList.add('brightlife-public-mode');
            body.innerHTML=`
                <div class="brightlife-homepage brightlife-reference-home">
                    ${brightlifePublicHeader_('home')}

                    <main id="public-home" class="brightlife-home-main">
                        <section class="reference-hero home-summary-hero" aria-labelledby="home-title">
                            <div class="reference-hero-copy">
                                <div class="reference-kicker">WELCOME TO SND BRIGHTLIFE <span>CBO</span></div>
                                <h1 id="home-title">Empowering People.<br><span>Building Livelihoods.</span><br>Transforming Communities.</h1>
                                <div class="reference-divider"></div>
                                <p>We are a community-led organization dedicated to creating opportunities, strengthening livelihoods and building brighter futures for individuals and communities.</p>
                                <div class="brightlife-hero-actions reference-actions">
                                    <button class="public-action primary" onclick="closeBrightlifeHomeMenu();showBrightlifeInnerPage('programs')">Explore Our Programmes <i class="fas fa-arrow-right"></i></button>
                                    <button class="public-action reference-outline" onclick="closeBrightlifeHomeMenu();showBrightlifeInnerPage('about')">Learn More <i class="fas fa-play"></i></button>
                                </div>
                                <div class="reference-values" aria-label="Our values">
                                    <span><i class="fas fa-piggy-bank"></i> SAVE</span><b>•</b><span><i class="fas fa-book-open"></i> LEARN</span><b>•</b><span><i class="fas fa-gear"></i> BUILD</span><b>•</b><span><i class="fas fa-people-group"></i> EMPOWER</span><b>•</b><span><i class="fas fa-leaf"></i> GROW</span>
                                </div>
                            </div>
                        </section>

                        <section class="reference-focus-section" aria-labelledby="focus-title">
                            <div class="reference-focus-grid">
                                <article class="reference-focus-card"><div class="reference-focus-icon water"><i class="fas fa-droplet"></i></div><h3>Clean Water &amp; Sanitation</h3><p>Healthy communities,<br>cleaner environments.</p></article>
                                <article class="reference-focus-card"><div class="reference-focus-icon education"><i class="fas fa-book-open"></i></div><h3>Education &amp; Mentorship</h3><p>Knowledge builds<br>opportunities.</p></article>
                                <article class="reference-focus-card"><div class="reference-focus-icon agriculture"><i class="fas fa-seedling"></i></div><h3>Agriculture &amp; Poultry</h3><p>Sustainable food,<br>lasting livelihoods.</p></article>
                                <article class="reference-focus-card"><div class="reference-focus-icon women"><i class="fas fa-person-circle-plus"></i></div><h3>Women &amp; Youth Empowerment</h3><p>Stronger people,<br>stronger livelihoods.</p></article>
                                <article class="reference-focus-card"><div class="reference-focus-icon skills"><i class="fas fa-gear"></i></div><h3>Skills &amp; Employability</h3><p>Practical skills for<br>a brighter future.</p></article>
                                <article class="reference-focus-card"><div class="reference-focus-icon finance"><i class="fas fa-arrow-trend-up"></i></div><h3>Entrepreneurship &amp; Finance</h3><p>Ideas into income,<br>communities into wealth.</p></article>
                            </div>
                        </section>

                        <section class="reference-home-bottom" aria-labelledby="quick-contact-title">
                            <div><span class="site-kicker">COMMUNITY • OPPORTUNITY • GROWTH</span><h2 id="quick-contact-title">Save. Learn. Build. Empower. Grow.</h2><p>Explore our programmes, view approved project updates, become a member, or connect with SND Brightlife CBO.</p></div>
                            <div class="reference-bottom-actions"><button class="public-action primary" onclick="navigateTo('projects')">View Projects</button><button class="public-action" onclick="showBrightlifeInnerPage('contact')">Contact Us</button></div>
                        </section>
                    </main>

                    <footer class="brightlife-home-footer reference-footer">
                        <div class="reference-footer-brand"><img src="https://i.ibb.co/Tx5GPpmN/Whats-App-Image-2026-09-04-at-09-51-28.jpg" alt="SND Brightlife CBO"><div><strong>SND BRIGHTLIFE CBO</strong><span>Empowering People. Building Livelihoods.<br>Transforming Communities.</span></div></div>
                        <div class="reference-footer-links"><button onclick="showPublicHome()">Home</button><i>│</i><button onclick="showBrightlifeInnerPage('about')">About Us</button><i>│</i><button onclick="showBrightlifeInnerPage('programs')">Programmes</button><i>│</i><button onclick="showBrightlifeInnerPage('finance')">Financial Empowerment</button><i>│</i><button onclick="showBrightlifeInnerPage('membership')">Membership</button><i>│</i><button onclick="navigateTo('projects')">Projects</button><i>│</i><button onclick="showBrightlifeInnerPage('partner')">Partner With Us</button><i>│</i><button onclick="showBrightlifeInnerPage('contact')">Contact</button></div>
                        <div class="reference-footer-contact"><span><i class="fas fa-phone"></i> +254 711 765 739</span><span><i class="fas fa-envelope"></i> sndbrightlife@gmail.com</span><span><i class="fas fa-location-dot"></i> Kenya</span></div>
                        <div class="reference-footer-line"></div><b>SAVE&nbsp; • &nbsp;LEARN&nbsp; • &nbsp;BUILD&nbsp; • &nbsp;EMPOWER&nbsp; • &nbsp;GROW</b>
                    </footer>
                </div>`;
            applyManagedHomepagePhotos();
            window.scrollTo({top:0,behavior:'auto'});
        }
        if(!document.getElementById('brightlifeProjectCardStyles')){var st=document.createElement('style');st.id='brightlifeProjectCardStyles';st.textContent='.project-card{cursor:pointer;position:relative;transition:transform .18s ease,box-shadow .18s ease}.project-card:hover{transform:translateY(-3px)}.project-card:focus-visible{outline:3px solid rgba(108,60,225,.35);outline-offset:3px}.project-card-link{margin-top:13px;font-size:12px;font-weight:800;color:var(--primary);text-decoration:underline;text-underline-offset:3px;display:inline-block}';document.head.appendChild(st);}

if(!document.getElementById('brightlifeProjectsPublicHeaderStyles')){var st=document.createElement('style');st.id='brightlifeProjectsPublicHeaderStyles';st.textContent='#mainWrapper.public-projects-mode{padding:0!important;margin:0!important;width:100%!important;max-width:none!important}#mainWrapper.public-projects-mode #dashboard{display:block!important;margin:0!important;padding:0!important;background:transparent!important;border-radius:0!important;box-shadow:none!important}#mainWrapper.public-projects-mode #dashboardContent{padding:0!important;margin:0!important}#mainWrapper.public-projects-mode .public-projects-landing{min-height:100vh;width:100%;padding-top:0!important}#mainWrapper.public-projects-mode .public-projects-content{max-width:1200px;margin:0 auto;padding:44px 28px 70px!important}#mainWrapper.public-projects-mode .public-projects-heading{padding:26px 0 30px;text-align:left}#mainWrapper.public-projects-mode .public-projects-heading h1{margin:7px 0 10px;font-size:clamp(32px,4vw,48px);letter-spacing:-.03em;color:#102033}#mainWrapper.public-projects-mode .public-projects-heading p{max-width:780px;margin:0;color:#5b6b7e;line-height:1.75}@media(max-width:700px){#mainWrapper.public-projects-mode .public-projects-content{padding:30px 16px 50px!important}#mainWrapper.public-projects-mode .public-projects-heading{padding-top:20px}}';document.head.appendChild(st);}
        async function loadProjectsPage(){
            const keys=['projects_intro','water','poultry','agriculture','bike_skills','education','entrepreneurship','women','youth','community_development','other'];
            const map=await getPublicContentMap(keys);
            const projects=[
                ['water','Water Supply','fa-faucet-drip','Clean Water, Treatment & Water Vending','Community water access, treatment, vending, hygiene and practical water-related development activities.'],
                ['poultry','Poultry Farming','fa-dove','Poultry Farming','Poultry activities that support household livelihoods, food security, practical skills and income opportunities.'],
                ['agriculture','Agriculture & Livelihoods','fa-seedling','Agriculture & Livelihoods','Farming, agribusiness, kitchen gardens, small livestock, value addition and livelihood strengthening.'],
                ['bike_skills','Bike Repair & Vocational Skills','fa-screwdriver-wrench','Bike Repair & Vocational Skills','Practical bicycle and motorcycle repair, workshop safety, customer service and basic business skills.'],
                ['education','Education Support','fa-school','Education Support','Learning support, mentorship, career guidance, digital literacy, vocational learning and life skills.'],
                ['entrepreneurship','Entrepreneurship & Small Business','fa-store','Entrepreneurship & Small Business','Enterprise skills, small-business development, financial knowledge, market access and sustainable income opportunities.'],
                ['women','Women Empowerment','fa-person-dress','Women Empowerment','Activities that strengthen women’s skills, participation, economic opportunities and community leadership.'],
                ['youth','Youth Empowerment','fa-people-arrows','Youth Empowerment','Skills, mentorship, entrepreneurship, digital learning and participation opportunities for young people.'],
                ['community_development','Community Development','fa-people-roof','Community Development','Community-led activities in water, education, agriculture, skills, environment, wellbeing and local development.'],
                ['other','Other Community Projects','fa-plus-circle','Other Community Projects','Additional approved community initiatives published as the organization expands its development work.']
            ];
            if(!document.getElementById('brightlifeProjectCardsStyles')){
                const st=document.createElement('style'); st.id='brightlifeProjectCardsStyles'; st.textContent=`
                    .brightlife-project-cards{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;margin-top:30px}
                    .brightlife-project-card{background:#fff;border:1px solid #e3e9f0;border-radius:22px;overflow:hidden;box-shadow:0 12px 35px rgba(8,25,45,.08);display:flex;flex-direction:column;min-height:100%}
                    .brightlife-project-card .project-card-image{height:155px;background:linear-gradient(135deg,#0b1d32,#17466b);display:grid;place-items:center;overflow:hidden}
                    .brightlife-project-card .project-card-image img{width:100%;height:100%;object-fit:cover;display:block}
                    .brightlife-project-card .project-card-icon{width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);display:grid;place-items:center;color:#fff;font-size:27px}
                    .brightlife-project-card .project-card-body{padding:23px;display:flex;flex-direction:column;flex:1}
                    .brightlife-project-card h3{margin:0 0 10px;color:#102033;font-size:21px;line-height:1.25}
                    .brightlife-project-card p{margin:0;color:#59687a;line-height:1.72;font-size:14px;flex:1}
                    .brightlife-project-card .project-view-btn{margin-top:20px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:11px;background:#102033;color:#fff;padding:12px 15px;font-weight:900;cursor:pointer;text-decoration:none}
                    .brightlife-project-card .project-view-btn:hover{background:#173b61;transform:translateY(-1px)}
                    .projects-page-note{max-width:820px;color:#59687a;line-height:1.8;margin-top:8px}
                    @media(max-width:1200px){.brightlife-project-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
                    @media(max-width:820px){.brightlife-project-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
                    @media(max-width:620px){.brightlife-project-cards{grid-template-columns:1fr}.brightlife-project-card .project-card-image{height:185px}}
                `; document.head.appendChild(st);
            }
            var body=document.getElementById('dashboardContent'); if(!body)return;
            var memberWorkspace=!!getCanonicalMemberId();
            var mw=document.getElementById('mainWrapper');
            var sidebar=document.getElementById('sidebar'); var topbar=document.getElementById('memberTopbar');
            if(memberWorkspace){
                if(mw)mw.classList.remove('public-projects-mode','public-site-mode');
                document.body.classList.add('workspace-active');
                if(sidebar){sidebar.style.display='flex';sidebar.classList.add('visible');sidebar.removeAttribute('aria-hidden');}
                if(topbar){topbar.style.display='flex';topbar.setAttribute('aria-hidden','false');}
                ensureAuthenticatedWorkspaceNavigation();
            }else{
                if(mw)mw.classList.add('public-projects-mode');
                if(sidebar)sidebar.style.display='none'; if(topbar)topbar.style.display='none';
            }
            body.innerHTML=`<div class="brightlife-public-page public-projects-landing ${memberWorkspace?'workspace-projects-page':''}" id="brightlife-projects-public-page">
                ${memberWorkspace?'':brightlifePublicHeader_('projects')}
                <main class="public-main-content public-projects-content">
                    <div class="public-projects-heading"><div class="site-kicker">PROJECTS &amp; COMMUNITY INITIATIVES</div><h1>Our Projects</h1><p class="projects-page-note">${escapeHtml(publicContentText(map,'projects_intro','Explore a project to view the latest information published by the authorized administrator or responsible project lead. Project pages display only approved and published updates.'))}</p></div>
                    <div class="brightlife-project-cards" id="brightlifeProjectCards"></div>
                </main>
            </div>`;
            const cards=document.getElementById('brightlifeProjectCards'); if(!cards)return;
            cards.innerHTML=projects.map(function(p){
                var title=publicContentTitle(map,p[0],p[3]); var body=publicContentText(map,p[0],p[4]); var image=projectImageUrl(map,p[0]);
                var imageHtml=image?`<div class="project-card-image"><img src="${String(image).replace(/"/g,'&quot;')}" alt="${escapeHtml(title)}"></div>`:`<div class="project-card-image"><div class="project-card-icon"><i class="fas ${p[2]}"></i></div></div>`;
                return `<article class="brightlife-project-card">${imageHtml}<div class="project-card-body"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p><button type="button" class="project-view-btn" onclick="showSelectedProjectUpdatesPage('${p[3].replace(/'/g,"\\'")}','${p[0]}')">View Project <i class="fas fa-arrow-right"></i></button></div></article>`;
            }).join('');
            window.scrollTo(0,0);
        }

        function showBrightlifeProject(key){
            const data=window.brightlifeProjectData||{}; const projects=data.projects||[]; const map=data.map||{};
            const project=projects.find(function(p){return p[0]===key})||projects[0]; if(!project)return;
            document.querySelectorAll('.brightlife-project-menu button').forEach(function(btn){btn.classList.toggle('active',btn.getAttribute('data-project-key')===project[0]);});
            const feed=document.getElementById('brightlifeProjectFeed'); if(!feed)return;
            const title=publicContentTitle(map,project[0],project[3]); const body=publicContentText(map,project[0],project[4]); const image=publicContentImage(map,project[0]);
            const updated=map[project[0]]&&map[project[0]].updated_at ? new Date(map[project[0]].updated_at) : null;
            const dateLabel=updated&&!isNaN(updated.getTime()) ? updated.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}) : 'Latest published update';
            const imageHtml=image?`<img src="${image.replace(/"/g,'&quot;')}" alt="${escapeHtml(title)}">`:'';
            feed.innerHTML=`<div class="brightlife-project-feed-head"><div class="kicker">Community Project</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(project[4])}</p></div><article class="brightlife-project-post"><div class="brightlife-project-post-meta">Latest published update · ${escapeHtml(dateLabel)}</div>${imageHtml}<h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`;
            window.scrollTo({top:0,behavior:'smooth'});
        }
        
        async function showSelectedProjectUpdatesPage(title,key){
            var landing=document.getElementById('publicHomeLanding'), projectPage=document.getElementById('publicProjectPage'), app=document.getElementById('app'), dashboard=document.getElementById('dashboard'), dashboardContent=document.getElementById('dashboardContent'), mainWrapper=document.getElementById('mainWrapper'), sidebar=document.getElementById('sidebar'), topbar=document.getElementById('memberTopbar');
            var memberSession=!!getCanonicalMemberId();

            // Members remain in the workspace. Selecting a project replaces only the
            // main content area; the workspace navigation stays visible and usable.
            if(memberSession){
                if(landing) landing.style.display='none';
                if(app) app.style.display='none';
                if(projectPage) { projectPage.style.display='none'; projectPage.innerHTML=''; }
                if(dashboard) { dashboard.style.display='block'; dashboard.classList.remove('brightlife-public-mode'); }
                if(topbar) { topbar.style.display='flex'; topbar.setAttribute('aria-hidden','false'); }
                if(sidebar) { sidebar.style.display=''; sidebar.classList.add('visible'); sidebar.removeAttribute('aria-hidden'); sidebar.style.zIndex='1000'; }
                document.body.classList.add('workspace-active');
                if(window.innerWidth <= 768 && sidebar) sidebar.classList.add('open');
                if(mainWrapper && mainWrapper.classList){
                    mainWrapper.classList.remove('public-site-mode','public-projects-mode');
                }
                syncWorkspaceLayout();
                if(dashboardContent){
                    dashboardContent.innerHTML='<div class="dashboard-body brightlife-workspace-project-page"><div class="workspace-project-header"><div class="workspace-project-kicker">SND BRIGHTLIFE CBO · PUBLISHED UPDATE</div><h1>'+escapeHtml(title)+'</h1><p>Latest approved information published for this project.</p></div><div class="workspace-project-content" id="selectedProjectBody"><div class="sp-empty"><i class="fas fa-spinner fa-spin"></i><div style="margin-top:10px;font-weight:800">Loading latest published update…</div></div></div></div>';
                }
                try{history.pushState({brightlife:'selected-project',page:'project-'+key},'', '#project-'+key);}catch(e){}
                if(!document.getElementById('brightlifeWorkspaceProjectStyles')){
                    var ws=document.createElement('style');
                    ws.id='brightlifeWorkspaceProjectStyles';
                    ws.textContent='.brightlife-workspace-project-page{padding:0!important;background:#f6f8fb;min-height:calc(100vh - 70px)}.workspace-project-header{background:linear-gradient(135deg,#071426,#17365a);color:#fff;padding:34px clamp(20px,4vw,46px) 38px}.workspace-project-kicker{text-transform:uppercase;letter-spacing:.11em;font-size:10px;font-weight:900;color:#a9c8ea}.workspace-project-header h1{margin:9px 0 8px;font-size:clamp(30px,4vw,46px);letter-spacing:-.03em}.workspace-project-header p{margin:0;color:rgba(255,255,255,.76);line-height:1.7;font-size:13px}.workspace-project-content{max-width:1180px;margin:0 auto;padding:28px clamp(16px,3vw,34px) 60px}.workspace-project-content .sp-card{background:#fff;border:1px solid #e1e7ee;border-radius:18px;overflow:hidden;box-shadow:0 10px 28px rgba(15,23,42,.07)}.workspace-project-content .sp-card img{width:100%;max-height:430px;object-fit:cover;display:block}.workspace-project-content .sp-body{padding:26px}.workspace-project-content .sp-body h2{margin:0 0 10px;color:#102033;font-size:24px}.workspace-project-content .sp-body p{margin:0;color:#526174;line-height:1.85;white-space:pre-line;font-size:14px}.workspace-project-content .sp-meta{margin-top:18px;padding-top:13px;border-top:1px solid #edf1f5;color:#8995a4;font-size:11px;font-weight:800}.workspace-project-content .sp-empty{text-align:center;padding:56px 22px;color:#718096;background:#fff;border:1px dashed #d7e0e9;border-radius:16px}.workspace-project-content .sp-empty i{font-size:26px;color:#5b6b7e}.brightlife-workspace-project-page{width:100%;box-sizing:border-box}@media(max-width:768px){.workspace-project-header{padding:26px 18px 30px}.workspace-project-content{padding:20px 14px 45px}.workspace-project-content .sp-body{padding:20px}.workspace-project-content .sp-body h2{font-size:21px}}';
                    document.head.appendChild(ws);
                }
                try{
                    var map=await getPublicContentMap([key]), r=map&&map[key], body=document.getElementById('selectedProjectBody');
                    if(!body)return;
                    var img=projectImageUrl(map,key);
                    if(!r || (!String(r.title||'').trim()&&!String(r.body||'').trim()&&!publicContentImage(map,key))){
                        body.innerHTML='<div class="sp-empty"><i class="fas fa-bullhorn"></i><div style="font-weight:900;color:#243447;margin:10px 0 5px">No published updates yet</div><div>Approved updates for '+escapeHtml(title)+' will appear here when published by the administration.</div></div>';
                        return;
                    }
                    var d=r.updated_at?new Date(r.updated_at):null;
                    var dateLabel=d&&!isNaN(d.getTime())?d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):'Recently published';
                    body.innerHTML='<article class="sp-card">'+(img?'<img src="'+String(img).replace(/"/g,'&quot;')+'" alt="'+escapeHtml(r.title||title)+'">':'')+'<div class="sp-body"><h2>'+escapeHtml(r.title||title)+'</h2><p>'+escapeHtml(r.body||'')+'</p><div class="sp-meta">Published update · '+escapeHtml(dateLabel)+'</div></div></article>';
                }catch(e){
                    var b=document.getElementById('selectedProjectBody');
                    if(b)b.innerHTML='<div class="sp-empty"><i class="fas fa-circle-exclamation"></i><div style="font-weight:900;color:#243447;margin:10px 0 5px">Unable to load this project</div><div>'+escapeHtml(e.message||'Please try again.')+'</div></div>';
                }
                return;
            }

            // Public visitors continue to use the standalone project presentation.
            if(landing) landing.style.display='none'; if(app) app.style.display='none'; if(dashboard) dashboard.style.display='none'; if(projectPage) projectPage.style.display='block';
            if(sidebar) { sidebar.style.display='none'; sidebar.classList.remove('visible','open'); }
            if(mainWrapper && mainWrapper.classList){
                mainWrapper.classList.add('public-site-mode');
                mainWrapper.classList.remove('public-projects-mode','with-sidebar');
            }
            try{history.pushState({brightlife:'selected-project',page:'project-'+key},'', '#project-'+key);}catch(e){}
            if(!document.getElementById('brightlifeSelectedProjectStyles')){var st=document.createElement('style');st.id='brightlifeSelectedProjectStyles';st.textContent='.brightlife-selected-project{min-height:100vh;background:#f6f8fb;color:#102033}.brightlife-selected-project .sp-header{background:linear-gradient(135deg,#071426,#162b46);color:#fff;padding:28px 22px}.brightlife-selected-project .sp-inner{max-width:1050px;margin:0 auto}.brightlife-selected-project .sp-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:10px;font-weight:900;opacity:.72}.brightlife-selected-project h1{font-size:clamp(28px,4vw,42px);margin:8px 0}.brightlife-selected-project .sp-content{max-width:1050px;margin:0 auto;padding:28px 22px 60px}.brightlife-selected-project .sp-card{background:#fff;border:1px solid #e4e9f0;border-radius:16px;overflow:hidden;box-shadow:0 8px 25px rgba(15,23,42,.06)}.brightlife-selected-project .sp-card img{width:100%;max-height:420px;object-fit:cover;display:block}.brightlife-selected-project .sp-body{padding:24px}.brightlife-selected-project .sp-body h2{margin:0 0 10px;font-size:22px}.brightlife-selected-project .sp-body p{margin:0;color:#526174;line-height:1.8;white-space:pre-line}.brightlife-selected-project .sp-meta{margin-top:18px;padding-top:12px;border-top:1px solid #edf1f5;color:#8995a4;font-size:11px;font-weight:800}.brightlife-selected-project .sp-empty{text-align:center;padding:55px 20px;color:#718096;background:#fff;border:1px dashed #d7e0e9;border-radius:16px}';document.head.appendChild(st);}
            projectPage.innerHTML='<div class="brightlife-selected-project">'+brightlifePublicHeader_('projects')+'<div class="sp-header"><div class="sp-inner"><div class="sp-kicker">SND Brightlife CBO · Published Updates</div><h1>'+escapeHtml(title)+'</h1><div style="opacity:.78;font-size:13px">Only published information for this selected project is shown.</div></div></div><div class="sp-content" id="selectedProjectBody"><div class="sp-empty"><i class="fas fa-spinner fa-spin"></i> Loading published updates…</div></div></div>';
            try{var map=await getPublicContentMap([key]), r=map&&map[key], body=document.getElementById('selectedProjectBody'); if(!body)return; var img=projectImageUrl(map,key); if(!r || (!String(r.title||'').trim()&&!String(r.body||'').trim()&&!publicContentImage(map,key))){body.innerHTML='<div class="sp-empty"><i class="fas fa-bullhorn" style="font-size:28px;margin-bottom:12px"></i><div style="font-weight:900;color:#243447;margin-bottom:5px">No published updates yet</div><div>Approved updates for '+escapeHtml(title)+' will appear here when published by the administration.</div></div>';return;} var d=r.updated_at?new Date(r.updated_at):null, dateLabel=d&&!isNaN(d.getTime())?d.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}):'Recently published'; body.innerHTML='<article class="sp-card">'+(img?'<img src="'+String(img).replace(/"/g,'&quot;')+'" alt="'+escapeHtml(r.title||title)+'">':'')+'<div class="sp-body"><h2>'+escapeHtml(r.title||title)+'</h2><p>'+escapeHtml(r.body||'')+'</p><div class="sp-meta">Published update · '+escapeHtml(dateLabel)+'</div></div></article>';}catch(e){var b=document.getElementById('selectedProjectBody');if(b)b.innerHTML='<div class="sp-empty"><i class="fas fa-circle-exclamation" style="font-size:28px;margin-bottom:12px"></i><div style="font-weight:900;color:#243447;margin-bottom:5px">Unable to load this project</div><div>'+escapeHtml(e.message||'Please try again.')+'</div></div>';}
        }

        async function loadTrainingsPage(){
            const map=await getPublicContentMap(['training','bike_skills','education','financial_literacy']);
            renderPublicShell('Learning & Capacity Building','Training, Skills & Financial Literacy','Practical learning activities that strengthen individual capacity, livelihoods and community participation.',`
                <div class="site-grid">
                    <div class="site-card"><div class="site-icon"><i class="fas fa-chalkboard-teacher"></i></div><h3>Seminars & Workshops</h3><p>${escapeHtml(publicContentText(map,'training','Document seminars, workshops, practical lessons, participants, key learning points and approved photographs.'))}</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-screwdriver-wrench"></i></div><h3>Vocational Skills</h3><p>${escapeHtml(publicContentText(map,'bike_skills','Bike repair and vocational skills include practical maintenance, troubleshooting, workshop safety, customer service and basic business management.'))}</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-school"></i></div><h3>Education & Life Skills</h3><p>${escapeHtml(publicContentText(map,'education','Education support may include mentorship, career guidance, digital literacy, financial literacy and life skills.'))}</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-calculator"></i></div><h3>Financial Literacy</h3><p>${escapeHtml(publicContentText(map,'financial_literacy','Practical financial knowledge supports responsible saving, borrowing, budgeting, enterprise planning and household decision-making.'))}</p></div>
                </div>
                ${adminQuickActionsHtml('training')}`);
        }

        function loadContactsPage(){
            renderPublicShell('Get in Touch','Contacts','Connect with SND Brightlife CBO for community programmes, projects, training activities, partnerships and member support.',`
                <div class="contact-list professional-contact-grid">
                    <a class="contact-item professional-contact-card" href="tel:+254711765739"><span class="contact-icon"><i class="fab fa-whatsapp"></i></span><div><strong>Phone / WhatsApp</strong><span>+254711765739</span><small>Call us for general enquiries and member support.</small></div></a>
                    <a class="contact-item professional-contact-card" href="mailto:sndbrightlife@gmail.com"><span class="contact-icon"><i class="fas fa-envelope"></i></span><div><strong>Email</strong><span>sndbrightlife@gmail.com</span><small>Send partnership, programme and general enquiries.</small></div></a>
                    <div class="contact-item professional-contact-card"><span class="contact-icon"><i class="fas fa-comments"></i></span><div><strong>Customer Care</strong><span>Secure member messaging</span><small>Logged-in members can use the Messages area for account support.</small></div></div>
                    <div class="contact-item professional-contact-card"><span class="contact-icon"><i class="fas fa-handshake"></i></span><div><strong>Partnerships & Projects</strong><span>Community collaboration</span><small>Contact us about programmes, training, projects and partnerships.</small></div></div>
                </div>`);
        }
        let dashboardLoadPromise = null;
        async function loadDashboard(forceRefresh) {
            if (dashboardLoadPromise && !forceRefresh) return dashboardLoadPromise;
            const run = async function(){
            const memberId = getCanonicalMemberId();
            if (!memberId) {
                setElementDisplaySafe('dashboard', 'none');
                setElementDisplaySafe('app', 'block');
                return;
            }

            const role = sessionStorage.getItem('memberRole');
            const isActive = sessionStorage.getItem('isActive') === 'true';
            const biodataCompleted = sessionStorage.getItem('biodataCompleted') === 'true';
            const registrationFeeStatus = sessionStorage.getItem('registrationFeeStatus') || 'pending';
            const profileEditStatus = sessionStorage.getItem('profileEditStatus') || 'pending';
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');
            forceRefresh = !!forceRefresh;

            try {
                const cacheKey = 'brightlife_dashboard_' + memberId;
                let result = null;
                if (!forceRefresh) {
                    try {
                        const raw = sessionStorage.getItem(cacheKey);
                        if (raw) {
                            const cached = JSON.parse(raw);
                            if (cached && cached.result && Date.now() - cached.savedAt < 15000) {
                                result = cached.result;
                                setTimeout(function() { loadDashboard(true); }, 25);
                            }
                        }
                    } catch (e) {}
                }
                if (!result) {
                    const actorId = sessionStorage.getItem('memberUuid') || memberId;
                    result = await callServer(
                        'getMemberProfile',
                        { memberId: memberId, actorId: actorId },
                        {force: forceRefresh}
                    );
                }
                if (!result.success) {
                    console.error('Dashboard data error:', result.message || 'Unknown error');
                    setElementDisplaySafe('app', 'none');
                    setElementDisplaySafe('dashboard', 'block');
                    document.getElementById('dashboardContent').innerHTML = `
                        <div class="dashboard-body">
                            <div class="status-banner warning" style="margin-bottom:18px;">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div><strong>Dashboard temporarily unavailable</strong><br><span style="font-size:13px;">${result.message || 'We could not load your account overview.'}</span></div>
                            </div>
                            <div style="text-align:center;padding:28px 16px;">
                                <button class="btn btn-primary" onclick="loadDashboard(true)"><i class="fas fa-sync-alt"></i> Retry Dashboard</button>
                             <button class="btn btn-outline" style="margin-left:8px;" onclick="repairMemberSession()"><i class="fas fa-user-check"></i> Repair Session</button>
                            </div>
                        </div>`;
                    return;
                }
                try { sessionStorage.setItem('brightlife_dashboard_' + memberId, JSON.stringify({savedAt: Date.now(), result: result})); } catch (e) {}

                setElementDisplaySafe('app', 'none');
                setElementDisplaySafe('dashboard', 'block');

                const member = result.profile;
                const effectiveIsActive = !!member.is_active;
                const effectiveBiodataCompleted = !!member.biodata_completed;
                const effectiveRegistrationFeeStatus = member.registration_fee_status || registrationFeeStatus;
                const effectiveProfileEditStatus = member.profile_edit_status || profileEditStatus;
                const transactions = result.transactions || [];
                const loans = result.loans || [];
                const repayments = result.repayments || [];

                let html = '<div class="dashboard-body">';
                if (!effectiveIsActive) {
                    html += `
                            <div class="status-banner warning">
                                <i class="fas fa-clock"></i>
                                ${!effectiveBiodataCompleted ? 'Complete your profile to get started.' : effectiveRegistrationFeeStatus === 'pending' ? 'Registration fee pending admin approval.' : effectiveRegistrationFeeStatus === 'rejected' ? 'Registration fee rejected. Please resubmit.' : 'Complete your profile and pay registration fee.'}
                            </div>
                        `;
                } else {
                    html += `
                            <div class="status-banner success">
                                <i class="fas fa-check-circle"></i>
                                Account Active — You're ready to save and borrow!
                            </div>
                        `;
                }
                if (effectiveProfileEditStatus === 'pending' && effectiveIsActive && role !== 'admin' && role !== 'super_admin') {
                    html += `
                            <div class="status-banner warning" style="background: #FEF3C7; border-color: #FDE68A; color: #92400E;">
                                <i class="fas fa-clock"></i>
                                Profile edit pending admin approval. You will be notified once approved.
                            </div>
                        `;
                }
                const roleDisplay = role === 'super_admin' ? '👑 Super Admin' :
                    role === 'admin' ? '👑 Administrator' :
                    role === 'treasurer' ? '💰 Treasurer' :
                    role === 'customer_care' ? '💬 Customer Care' :
                    role === 'profile_approver' ? '📝 In-charge / Profile Approver' : 'Member';
                const firstName = String(member.full_name || member.name || 'Member').trim().split(/\s+/)[0] || 'Member';
                const hour = new Date().getHours();
                const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

                html += `
                        <div class="welcome-hero">
                            <div><div class="welcome-kicker">SND Brightlife CBO</div><div class="welcome-title">${greeting}, ${firstName}.</div><div class="welcome-sub">Here is your account overview for today.</div></div>
                            <div class="member-code-card"><div class="code-label">Member Code</div><div class="code">${member.unique_member_id || 'CDO----'}</div><div class="code-name">${member.full_name || ''}</div></div>
                        </div>
                    `;
                let taskHtml = '';
                const hasTasks = role === 'super_admin' || role === 'admin' || role === 'treasurer' || role ===
                    'customer_care' || role === 'profile_approver' ||
                    Object.values(permissions).some(v => v === true);

                if (hasTasks && isActive) {
                    taskHtml += `
                            <div style="margin-bottom:16px;">
                                <h3 style="font-size:14px; font-weight:600; color:var(--gray-700); margin-bottom:10px;"><i class="fas fa-tasks" style="color:var(--primary);"></i> Your Tasks</h3>
                                <div style="display:grid; gap:8px;">
                        `;

                    if (role === 'super_admin' || role === 'admin') {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('admin')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#EDE9FE; color:#5B21B6; display:flex; align-items:center; justify-content:center;"><i class="fas fa-shield-alt"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">Organization Pending Approvals</div>
                                            <div style="font-size:12px; color:var(--gray-500);">Review and approve pending requests</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);">${pendingCount || 0} pending</span>
                                </div>
                            `;
                    }

                    if (role === 'treasurer' || permissions.savings_approval) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('admin')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#D1FAE5; color:#059669; display:flex; align-items:center; justify-content:center;"><i class="fas fa-money-bill-wave"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">Approve Savings</div>
                                            <div style="font-size:12px; color:var(--gray-500);">Review and approve savings deposits</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);">Pending</span>
                                </div>
                            `;
                    }

                    if (role === 'customer_care' || permissions.customer_care) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('chat')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#DBEAFE; color:#1D4ED8; display:flex; align-items:center; justify-content:center;"><i class="fas fa-headset"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">Customer Care</div>
                                            <div style="font-size:12px; color:var(--gray-500);">Respond to member messages</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);">Messages</span>
                                </div>
                            `;
                    }

                    if (role === 'profile_approver' || permissions.profile_approval) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('admin')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-edit"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">Approve Profile Edits</div>
                                            <div style="font-size:12px; color:var(--gray-500);">Review and approve member profile changes</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);">Pending</span>
                                </div>
                            `;
                    }

                    if (permissions.view_members) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('members')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#EDE9FE; color:#5B21B6; display:flex; align-items:center; justify-content:center;"><i class="fas fa-users"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">View Members</div>
                                            <div style="font-size:12px; color:var(--gray-500);">View all member profiles</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);"><i class="fas fa-arrow-right"></i></span>
                                </div>
                            `;
                    }

                    if (permissions.view_repayments) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('repayments')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#DBEAFE; color:#1D4ED8; display:flex; align-items:center; justify-content:center;"><i class="fas fa-history"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">View Repayments</div>
                                            <div style="font-size:12px; color:var(--gray-500);">View loan repayment history</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);"><i class="fas fa-arrow-right"></i></span>
                                </div>
                            `;
                    }

                    if (permissions.grant_rights) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('rights')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-lock"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">Manage Rights</div>
                                            <div style="font-size:12px; color:var(--gray-500);">Manage member permissions</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);"><i class="fas fa-arrow-right"></i></span>
                                </div>
                            `;
                    }

                    if (permissions.view_reports) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('reports')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#DBEAFE; color:#1D4ED8; display:flex; align-items:center; justify-content:center;"><i class="fas fa-chart-bar"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">View Reports</div>
                                            <div style="font-size:12px; color:var(--gray-500);">View system reports and analytics</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);"><i class="fas fa-arrow-right"></i></span>
                                </div>
                            `;
                    }

                    if (permissions.view_savings) {
                        taskHtml += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:12px 16px; border:1px solid var(--gray-200); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="navigateTo('savings')">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <div style="width:32px; height:32px; border-radius:50%; background:#D1FAE5; color:#059669; display:flex; align-items:center; justify-content:center;"><i class="fas fa-piggy-bank"></i></div>
                                        <div>
                                            <div style="font-weight:500; color:var(--gray-800);">View Savings</div>
                                            <div style="font-size:12px; color:var(--gray-500);">View all savings transactions</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; color:var(--primary);"><i class="fas fa-arrow-right"></i></span>
                                </div>
                            `;
                    }

                    taskHtml += `</div></div>`;
                }
                if (role === 'member' && !Object.values(permissions).some(v => v === true) && !isActive) {
                    html += `
                            <div style="display:flex; gap:16px; margin-bottom:20px; padding:16px; background:var(--gray-50); border-radius:var(--radius-xs);">
                                <div style="flex:1; text-align:center;">
                                    <div style="width:32px; height:32px; border-radius:50%; background:${biodataCompleted ? '#10B981' : '#6C3CE1'}; color:white; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">${biodataCompleted ? '✓' : '1'}</div>
                                    <div style="font-size:11px; margin-top:4px; color:${biodataCompleted ? '#059669' : 'var(--gray-700)'}; font-weight:${biodataCompleted ? '400' : '600'};">Profile</div>
                                </div>
                                <div style="flex:1; text-align:center;">
                                    <div style="width:32px; height:32px; border-radius:50%; background:${isActive ? '#10B981' : (biodataCompleted ? '#6C3CE1' : '#E5E7EB')}; color:${isActive ? 'white' : (biodataCompleted ? 'white' : '#9CA3AF')}; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">${isActive ? '✓' : '2'}</div>
                                    <div style="font-size:11px; margin-top:4px; color:${isActive ? '#059669' : (biodataCompleted ? 'var(--gray-700)' : '#9CA3AF')}; font-weight:${isActive ? '400' : (biodataCompleted ? '600' : '400')};">Payment</div>
                                </div>
                                <div style="flex:1; text-align:center;">
                                    <div style="width:32px; height:32px; border-radius:50%; background:${isActive && biodataCompleted ? '#10B981' : '#E5E7EB'}; color:${isActive && biodataCompleted ? 'white' : '#9CA3AF'}; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">${isActive && biodataCompleted ? '✓' : '3'}</div>
                                    <div style="font-size:11px; margin-top:4px; color:#9CA3AF;">Start</div>
                                </div>
                            </div>
                        `;

                    if (!biodataCompleted) {
                        html += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:14px 18px; margin-bottom:10px; border:1px solid var(--gray-200); cursor:pointer;" onclick="navigateTo('profile')">
                                    <div style="display:flex; align-items:center; gap:12px;">
                                        <div style="width:36px; height:36px; border-radius:8px; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-edit"></i></div>
                                        <div><div style="font-weight:600; color:var(--gray-800);">Complete Your Profile</div><div style="font-size:12px; color:var(--gray-500);">Fill in your biodata including next of kin</div></div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; background:#FEF3C7; color:#D97706;">Pending</span>
                                </div>
                            `;
                    } else if (registrationFeeStatus === 'pending' || registrationFeeStatus === 'rejected') {
                        html += `
                                <div style="background:white; border-radius:var(--radius-xs); padding:14px 18px; margin-bottom:10px; border:1px solid var(--gray-200); cursor:pointer;" onclick="showSavingsModal()">
                                    <div style="display:flex; align-items:center; gap:12px;">
                                        <div style="width:36px; height:36px; border-radius:8px; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center;"><i class="fas fa-money-bill-wave"></i></div>
                                        <div>
                                            <div style="font-weight:600; color:var(--gray-800);">${registrationFeeStatus === 'rejected' ? 'Registration Fee Rejected - Resubmit' : 'Pay Registration Fee'}</div>
                                            <div style="font-size:12px; color:var(--gray-500);">${registrationFeeStatus === 'rejected' ? 'Your payment was rejected. Please resubmit.' : 'Pay KES 500 to activate your account'}</div>
                                        </div>
                                    </div>
                                    <span style="font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; ${registrationFeeStatus === 'rejected' ? 'background:#FEE2E2; color:#DC2626;' : 'background:#FEF3C7; color:#D97706;'}">${registrationFeeStatus === 'rejected' ? 'Resubmit' : 'Pay Now'}</span>
                                </div>
                            `;
                    }
                }
                const accountAgeMonths = Number(member.account_age_months || 0);
                const activeLoan = loans.find(l => l.status === 'active') || null;
                const totalSavings = Number(member.savings_balance || 0);
                const totalLoanPaid = loans.reduce((sum, l) => sum + Number(l.amount_paid || 0), 0);
                const activeLoanBalance = activeLoan ? Math.max(0, Number(activeLoan.total_repayment || 0) - Number(activeLoan.amount_paid || 0)) : 0;
                const loanLimit = Number(member.loan_limit_effective || member.loan_hard_cap || member.loan_limit || 0);
                const savingsMonths = Number.isFinite(Number(member.qualifying_savings_months)) ? Number(member.qualifying_savings_months) : (Array.isArray(member.qualifying_savings_months) ? member.qualifying_savings_months.length : 0);
                const accountEligibleForLoan = accountAgeMonths >= 3 && savingsMonths >= 3;
                const displayLoanLimit = accountEligibleForLoan ? loanLimit : 0;
                const loanEligibility = member.loan_eligibility || {};
                const hasTakenLoan = loans.length > 0;

                if (role === 'member' && isActive) {
                    const repaymentMetric = activeLoan ? 'KES ' + totalLoanPaid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' paid' : (hasTakenLoan ? 'KES ' + totalLoanPaid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}) : 'No loan taken');
                    const loanMetric = activeLoan ? 'KES ' + activeLoanBalance.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' balance' : (hasTakenLoan ? 'No active balance' : 'No active loan');
                    html += `
                        <div class="metric-grid">
                            <div class="metric-surface"><div class="metric-label">Savings</div><div class="metric-value">KES ${totalSavings.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Member savings balance</div></div>
                            <div class="metric-surface"><div class="metric-label">Loan Balance</div><div class="metric-value">${loanMetric}</div><div class="metric-sub">${activeLoan ? 'Current active loan' : 'Borrowing position'}</div></div>
                            <div class="metric-surface"><div class="metric-label">Repayment</div><div class="metric-value">${repaymentMetric}</div><div class="metric-sub">${hasTakenLoan ? 'Total recorded repayments' : 'Repayment history'}</div></div>
                            <div class="metric-surface"><div class="metric-label">Loan Limit</div><div class="metric-value">KES ${displayLoanLimit.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Maximum by current eligibility</div></div>
                            <div class="metric-surface"><div class="metric-label">Loans Taken</div><div class="metric-value">${loans.length}</div><div class="metric-sub">${member.total_loans_completed || 0} completed</div></div>
                            <div class="metric-surface"><div class="metric-label">Savings Months</div><div class="metric-value">${savingsMonths}/3</div><div class="metric-sub">Qualifying months</div></div>
                            <div class="metric-surface"><div class="metric-label">On-time Repayments</div><div class="metric-value">${member.on_time_repayments || 0}</div><div class="metric-sub">Repayment performance</div></div>
                            <div class="metric-surface"><div class="metric-label">Loan Growth</div><div class="metric-value">${String(member.loan_growth_tier || 'Basic').replace(/^./, c => c.toUpperCase())}</div><div class="metric-sub">${Number(member.loan_growth_score || 0)}/100 score</div></div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-title"><i class="fas fa-chart-line" style="color:var(--primary);margin-right:6px;"></i> Account Summary</div>
                            <div class="summary-text">${activeLoan ? 'You currently have an active loan with <strong>KES ' + activeLoanBalance.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</strong> remaining. You have paid <strong>KES ' + totalLoanPaid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</strong> so far.' : hasTakenLoan ? 'Your previous loan activity is recorded and there is no active loan balance at the moment.' : 'You have no active loan. Keep your savings consistent to strengthen your borrowing eligibility.'} ${savingsMonths < 3 ? 'You need savings activity in at least <strong>3 distinct months</strong> before qualifying for a loan.' : (loanEligibility.eligible ? 'You currently meet the core savings-duration requirement for loan consideration.' : 'Your loan eligibility remains subject to account status, savings and approval requirements.')}</div>
                        </div>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
                            ${accountEligibleForLoan && !activeLoan ? '<button class="btn-primary" onclick="showLoanModal()"><i class="fas fa-hand-holding-usd"></i> Apply for Loan</button>' : ''}
                            ${activeLoan && activeLoanBalance > 0 ? '<button class="btn-primary" onclick="showRepaymentModal(\'' + activeLoan.id + '\',' + activeLoanBalance.toFixed(2) + ')"><i class="fas fa-money-check-dollar"></i> Repay Loan</button>' : ''}
                            ${activeLoan ? '<button class="btn-outline" onclick="navigateTo(\'repayments\')"><i class="fas fa-history"></i> Repayment History</button>' : ''}
                        </div>
                    `;
                    setElementDisplaySafe('nav-admin-repayments', (hasTakenLoan || activeLoan) ? 'flex' : 'none');
                    setElementDisplaySafe('nav-guarantors', (role === 'member' && isActive) ? 'flex' : 'none');
                    loadGuarantorRequests();
                }
                if (role === 'member' && isActive && transactions.length > 0) {
                    html += `
                        <div class="section-card" style="margin-top:16px;">
                            <div class="section-title"><i class="fas fa-clock-rotate-left"></i> Recent Activity <span style="margin-left:auto;font-size:11px;color:var(--primary);cursor:pointer;" onclick="navigateTo('transactions')">View all</span></div>
                            ${transactions.slice(0,6).map(t => { const credit=['savings','loan_disbursement'].includes(t.type); return `<div style="display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-100);"><div><div style="font-size:12px;font-weight:700;color:var(--gray-800);">${t.description || t.type}</div><div style="font-size:10px;color:var(--gray-500);">${new Date(t.created_at).toLocaleDateString()} • ${t.status || 'pending'}</div></div><div style="font-size:12px;font-weight:800;color:${credit?'#059669':'#DC2626'};">${credit?'+':'-'} KES ${Number(t.amount||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>`; }).join('')}
                        </div>
                    `;
                }

                html += '</div>';
                document.getElementById('dashboardContent').innerHTML = html;
                if (role === 'super_admin' || role === 'admin' || role === 'treasurer' || role === 'profile_approver' || role === 'customer_care' || permissions.view_members || permissions.savings_approval ||
                    permissions.loan_approval || permissions.profile_approval || permissions.withdrawal_approval || permissions.registration_approval) {
                    try {
                        const adminStats = await callServer('getDashboardStats', {memberId: getCanonicalMemberId()}, {force:false});
                        if (adminStats && adminStats.success !== false) {
                            const totalPending = Number(adminStats.pendingRegistrations || 0) + Number(adminStats.pendingTransactions || 0) + Number(adminStats.pendingLoans || 0) + Number(adminStats.pendingWithdrawals || 0) + Number(adminStats.pendingProfileEdits || 0);
                            document.getElementById('pendingBadge').textContent = totalPending;
                            const approvalBadge = document.getElementById('approvalBadge');
                            if (approvalBadge) approvalBadge.textContent = totalPending;
                            pendingCount = totalPending;
                        }
                    } catch (e) {}
                }
                try {
                    const msgResult = await callServer('getUnreadMessages', { memberId: memberId });
                    if (msgResult.success) {
                        const count = msgResult.count || 0;
                        document.getElementById('messageBadge').textContent = count;
                        setElementDisplaySafe('messageBadge', count > 0 ? 'inline' : 'none');
                        messageCount = count;
                    }
                } catch (e) {}

            } catch (error) {
                console.error('Dashboard error:', error);
                setElementDisplaySafe('app', 'none');
                setElementDisplaySafe('dashboard', 'block');
                document.getElementById('dashboardContent').innerHTML = `
                    <div class="dashboard-body">
                        <div class="status-banner warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div><strong>Unable to load dashboard</strong><br><span style="font-size:13px;">${error && error.message ? error.message : 'Please try again.'}</span></div>
                        </div>
                        <div style="text-align:center;padding:28px 16px;">
                            <button class="btn btn-primary" onclick="loadDashboard(true)"><i class="fas fa-sync-alt"></i> Retry Dashboard</button>
                        </div>
                    </div>`;
            }
            };
            dashboardLoadPromise=run();
            try {
                return await dashboardLoadPromise;
            } finally {
                dashboardLoadPromise=null;
                if (getCanonicalMemberId() && typeof ensureAuthenticatedWorkspaceNavigation === 'function') {
                    ensureAuthenticatedWorkspaceNavigation();
                    requestAnimationFrame(function(){ ensureAuthenticatedWorkspaceNavigation(); });
                    setTimeout(function(){ ensureAuthenticatedWorkspaceNavigation(); }, 120);
                }
            }
        }
        function renderLoanGrowthStatus(status) {
            const tierEmojis = {
                'platinum': '💎',
                'gold': '🏆',
                'silver': '🥈',
                'bronze': '🥉',
                'basic': '📘'
            };

            const evaluation = status.evaluation;
            const tierDisplay = status.tier.charAt(0).toUpperCase() + status.tier.slice(1);

            const isMobile = window.innerWidth <= 480;

            return `
                    <div class="section-card" style="border-color: var(--primary); padding: ${isMobile ? '12px' : '16px'};">
                        <div class="section-title" style="font-size: ${isMobile ? '13px' : '15px'}; flex-wrap: wrap; gap: 6px;">
                            <i class="fas fa-chart-line" style="color:var(--primary);"></i> 
                            Loan Growth Status
                            <button class="btn-sm btn-info" onclick="refreshLoanGrowth()" style="background:#3B82F6; color:white; margin-left:auto; padding:${isMobile ? '3px 8px' : '4px 12px'}; font-size:${isMobile ? '10px' : '12px'}; white-space:nowrap;">
                                <i class="fas fa-sync-alt"></i> ${isMobile ? '' : 'Update'}
                            </button>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:${isMobile ? '4px' : '10px'}; margin-bottom:10px;">
                            <div style="background:var(--gray-50); padding:${isMobile ? '6px 8px' : '8px 12px'}; border-radius:var(--radius-xs); text-align:center;">
                                <div style="font-size:${isMobile ? '9px' : '11px'}; color:var(--gray-500);">Current Limit</div>
                                <div style="font-size:${isMobile ? '14px' : '18px'}; font-weight:800; color:var(--gray-800); word-break:break-word;">
                                    KES ${status.currentLimit.toFixed(2)}
                                </div>
                            </div>
                            <div style="background:var(--gray-50); padding:${isMobile ? '6px 8px' : '8px 12px'}; border-radius:var(--radius-xs); text-align:center;">
                                <div style="font-size:${isMobile ? '9px' : '11px'}; color:var(--gray-500);">Tier</div>
                                <div style="font-size:${isMobile ? '13px' : '16px'}; font-weight:700; color:var(--gray-800);">
                                    ${tierEmojis[status.tier] || ''} ${tierDisplay}
                                </div>
                            </div>
                            <div style="background:var(--gray-50); padding:${isMobile ? '6px 8px' : '8px 12px'}; border-radius:var(--radius-xs); text-align:center;">
                                <div style="font-size:${isMobile ? '9px' : '11px'}; color:var(--gray-500);">Score</div>
                                <div style="font-size:${isMobile ? '14px' : '18px'}; font-weight:800; color:var(--gray-800);">
                                    ${status.score}/100
                                </div>
                            </div>
                        </div>
                        ${evaluation ? `
                            <div style="margin-top:8px;">
                                <div style="display:flex; justify-content:space-between; font-size:${isMobile ? '10px' : '12px'}; color:var(--gray-500);">
                                    <span>Progress to next tier</span>
                                    <span>${Math.round(status.score)}%</span>
                                </div>
                                <div style="width:100%; height:6px; background:var(--gray-200); border-radius:10px; overflow:hidden; margin-top:2px;">
                                    <div style="width:${Math.min(100, status.score)}%; height:100%; background:var(--primary-gradient); border-radius:10px; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                            <div style="margin-top:8px; display:grid; grid-template-columns: 1fr 1fr; gap:${isMobile ? '4px' : '8px'};">
                                <div style="background:var(--gray-50); padding:${isMobile ? '4px 6px' : '6px 10px'}; border-radius:var(--radius-xs); text-align:center;">
                                    <div style="font-size:${isMobile ? '8px' : '10px'}; color:var(--gray-500);">Repayment</div>
                                    <div style="font-size:${isMobile ? '12px' : '14px'}; font-weight:600; color:var(--gray-800);">${evaluation.breakdown?.repayment?.score || 0}/100</div>
                                </div>
                                <div style="background:var(--gray-50); padding:${isMobile ? '4px 6px' : '6px 10px'}; border-radius:var(--radius-xs); text-align:center;">
                                    <div style="font-size:${isMobile ? '8px' : '10px'}; color:var(--gray-500);">Savings</div>
                                    <div style="font-size:${isMobile ? '12px' : '14px'}; font-weight:600; color:var(--gray-800);">${evaluation.breakdown?.savings?.score || 0}/100</div>
                                </div>
                                <div style="background:var(--gray-50); padding:${isMobile ? '4px 6px' : '6px 10px'}; border-radius:var(--radius-xs); text-align:center;">
                                    <div style="font-size:${isMobile ? '8px' : '10px'}; color:var(--gray-500);">Borrowing</div>
                                    <div style="font-size:${isMobile ? '12px' : '14px'}; font-weight:600; color:var(--gray-800);">${evaluation.breakdown?.borrowing?.score || 0}/100</div>
                                </div>
                                <div style="background:var(--gray-50); padding:${isMobile ? '4px 6px' : '6px 10px'}; border-radius:var(--radius-xs); text-align:center;">
                                    <div style="font-size:${isMobile ? '8px' : '10px'}; color:var(--gray-500);">Reliability</div>
                                    <div style="font-size:${isMobile ? '12px' : '14px'}; font-weight:600; color:var(--gray-800);">${evaluation.breakdown?.reliability?.score || 0}/100</div>
                                </div>
                            </div>
                        ` : ''}
                        <div style="margin-top:8px; font-size:${isMobile ? '9px' : '11px'}; color:var(--gray-400); text-align:center;">
                            <i class="fas fa-info-circle"></i> Based on repayment, savings, borrowing & reliability
                        </div>
                    </div>
                `;
        }
        async function refreshLoanGrowth() {
            const memberId = getCanonicalMemberId();
            if (!memberId) { showToast('Your member session could not be identified. Please sign in again.', 'error'); return; }
            showToast('Updating loan growth status...', 'info');
            try {
                const result = await callServer('evaluateLoanGrowth', {memberId: memberId, actorId: memberId, sessionToken: sessionStorage.getItem('brightlifeSessionToken') || ''}, {force:true});
                if (!result || !result.success) { showToast((result && result.message) || 'Loan growth update failed.', 'error'); return; }
                showToast(result.message || 'Loan growth updated successfully.', 'success');
                await loadLoansPage();
            } catch (error) { showToast('Error: ' + error.message, 'error'); }
        }
        async function loadSavingsPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) return;

                const member = result.profile;
                const transactions = result.transactions || [];
                const savingsTransactions = transactions.filter(t => t.type === 'savings');
                const withdrawals = transactions.filter(t => t.type === 'withdrawal');

                const totalSavings = member.savings_balance || 0;
                const withdrawalFee = member.withdrawal_fee || 0.2;
                const withdrawable = Math.max(0, totalSavings);

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-piggy-bank" style="color:var(--primary);"></i> Savings</h2>
                            </div>

                            <div class="balance-card">
                                <div class="balance-label">Total Savings</div>
                                <div class="balance-amount">KES ${totalSavings.toFixed(2)}</div>
                                <div class="balance-details">
                                    <span><i class="fas fa-arrow-up"></i> Withdrawable: KES ${withdrawable.toFixed(2)}</span>
                                    <span><i class="fas fa-percent"></i> Fee: ${withdrawalFee * 100}%</span>
                                </div>
                            </div>

                            <div style="display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap;">
                                <button class="btn-primary" onclick="showSavingsModal()" style="flex:1; min-width:120px;">
                                    <i class="fas fa-plus"></i> Deposit
                                </button>
                                <button class="btn-secondary" onclick="showWithdrawalModal()" style="flex:1; min-width:120px;">
                                    <i class="fas fa-arrow-up"></i> Withdraw
                                </button>
                            </div>

                            <div class="section-card">
                                <div class="section-title"><i class="fas fa-arrow-down" style="color:#059669;"></i> Deposits</div>
                                ${savingsTransactions.length === 0 ? `
                                    <div class="empty-state">
                                        <i class="fas fa-piggy-bank" style="color:var(--gray-300);"></i>
                                        <p>No savings deposits yet</p>
                                    </div>
                                ` : savingsTransactions.map(t => `
                                    <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--gray-100); flex-wrap:wrap; gap:6px;">
                                        <div>
                                            <div style="font-size:13px; font-weight:500; color:var(--gray-800);">${t.description || 'Savings Deposit'}</div>
                                            <div style="font-size:11px; color:var(--gray-400);">${new Date(t.created_at).toLocaleDateString()} ${new Date(t.created_at).toLocaleTimeString()}</div>
                                            ${t.mpesa_code ? `<div style="font-size:11px; color:var(--gray-400);">M-Pesa: ${t.mpesa_code}</div>` : ''}
                                            <div style="font-size:11px; color:var(--gray-500);">Status: ${t.status === 'pending' ? '⏳ Pending' : t.status === 'completed' ? '✅ Approved' : '❌ Rejected'}</div>
                                        </div>
                                        <div style="font-weight:600; color:#059669;">
                                            + KES ${t.amount.toFixed(2)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="section-card">
                                <div class="section-title"><i class="fas fa-arrow-up" style="color:#DC2626;"></i> Withdrawals</div>
                                ${withdrawals.length === 0 ? `
                                    <div class="empty-state">
                                        <i class="fas fa-arrow-up" style="color:var(--gray-300);"></i>
                                        <p>No withdrawals yet</p>
                                    </div>
                                ` : withdrawals.map(t => `
                                    <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--gray-100); flex-wrap:wrap; gap:6px;">
                                        <div>
                                            <div style="font-size:13px; font-weight:500; color:var(--gray-800);">${t.description || 'Withdrawal'}</div>
                                            <div style="font-size:11px; color:var(--gray-400);">${new Date(t.created_at).toLocaleDateString()} ${new Date(t.created_at).toLocaleTimeString()}</div>
                                            <div style="font-size:11px; color:var(--gray-500);">Status: ${t.status === 'pending' ? '⏳ Pending' : t.status === 'completed' ? '✅ Approved' : '❌ Rejected'}</div>
                                        </div>
                                        <div style="font-weight:600; color:#DC2626;">
                                            - KES ${t.amount.toFixed(2)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <div style="margin-top:16px;">
                                <button class="btn-outline" onclick="navigateTo('dashboard')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading savings: ' + error.message, 'error');
            }
        }
        function loadLoansOverviewPage() {
            var body=document.getElementById('dashboardContent');
            if(!body) return;
            body.innerHTML=`<div class="dashboard-body">
                <div class="welcome-hero"><div><div class="welcome-kicker">Table Banking</div><div class="welcome-title">Loans</div><div class="welcome-sub">Understand Brightlife lending before starting an application.</div></div></div>
                <div class="site-grid">
                    <div class="site-card"><div class="site-icon"><i class="fas fa-calendar-check"></i></div><h3>Eligibility</h3><p>Members should save consistently for at least 3 months before becoming eligible to apply for a loan, subject to assessment and approval.</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-chart-line"></i></div><h3>Loan Limit</h3><p>Eligible borrowing can be assessed up to 3× qualifying savings, subject to available funds, repayment ability and approval.</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-user-shield"></i></div><h3>Guarantors</h3><p>Loan applications require at least two active member guarantors whose responses are recorded before approval.</p></div>
                    <div class="site-card"><div class="site-icon"><i class="fas fa-percent"></i></div><h3>Interest</h3><p>12% up to 7 days; 16% for 8–14 days; 18% for 15–20 days; and 20% for 21–30 days.</p></div>
                </div>
                <div class="section-card" style="margin-top:18px"><div class="section-title"><i class="fas fa-arrow-right"></i> Next Step</div><p style="color:var(--gray-600);line-height:1.7;font-size:13px">Use <strong>Loan Management</strong> to check your personal eligibility, apply, view loan history and make repayments.</p><button class="btn-primary" onclick="navigateTo('loanmanagement')"><i class="fas fa-hand-holding-usd"></i> Open Loan Management</button></div>
            </div>`;
        }
        async function loadLoansPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;
            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) throw new Error(result.message || 'Unable to load loans');
                const member = result.profile || {}, loans = result.loans || [];
                const activeLoan = loans.find(l => l.status === 'active') || null;
                const eligibleSavings = Number(member.eligible_savings || member.savings_balance || 0);
                const loanLimitRaw = Number(member.loan_limit_effective || member.loan_hard_cap || member.loan_limit || 0);
                const savingsMonths = Number.isFinite(Number(member.qualifying_savings_months)) ? Number(member.qualifying_savings_months) : (Array.isArray(member.qualifying_savings_months) ? member.qualifying_savings_months.length : 0);
                const accountAgeMonths = Number(member.account_age_months || 0);
                const loanLimit = (accountAgeMonths >= 3 && savingsMonths >= 3) ? loanLimitRaw : 0;
                const eligible = !activeLoan && !!member.is_active && savingsMonths >= 3 && eligibleSavings > 0;
                const paidTotal = loans.reduce((a,l)=>a+Number(l.amount_paid||0),0);
                const activeBalance = activeLoan ? Math.max(0,Number(activeLoan.total_repayment||0)-Number(activeLoan.amount_paid||0)) : 0;
                let html = `<div class="dashboard-body">
                    <div class="welcome-hero"><div><div class="welcome-kicker">Lending & Credit</div><div class="welcome-title">Loan Management</div><div class="welcome-sub">Eligibility, loan growth and repayment position in one place.</div></div><div class="member-code-card"><div class="code-label">Member Code</div><div class="code">${member.unique_member_id||'CDO----'}</div><div class="code-name">${member.full_name||''}</div></div></div>
                    <div class="metric-grid">
                        <div class="metric-surface"><div class="metric-label">Eligible Savings</div><div class="metric-value">KES ${eligibleSavings.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Savings used for loan assessment</div></div>
                        <div class="metric-surface"><div class="metric-label">Loan Limit</div><div class="metric-value">KES ${loanLimit.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Capped at 3× eligible savings</div></div>
                        <div class="metric-surface"><div class="metric-label">Loan Balance</div><div class="metric-value">KES ${activeBalance.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">${activeLoan?'Current active loan':'No active loan'}</div></div>
                        <div class="metric-surface"><div class="metric-label">Amount Repaid</div><div class="metric-value">KES ${paidTotal.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Recorded loan repayments</div></div>
                    </div>
                    <div class="section-card"><div class="section-title"><i class="fas fa-list-check"></i> Loan Eligibility</div>
                        <div class="eligibility-stack">
                            <div class="eligibility-card"><div><div class="ec-label">Eligibility status</div><div class="ec-value">${eligible?'Eligible for application':'Not currently eligible'}</div></div><span class="loan-status ${eligible?'completed':'pending'}">${eligible?'READY':'REVIEW'}</span></div>
                            <div class="eligibility-card"><div><div class="ec-label">Savings consistency</div><div class="ec-value">${savingsMonths} of 3 qualifying months</div></div><span>${savingsMonths>=3?'✓':'⏳'}</span></div>
                            <div class="eligibility-card"><div><div class="ec-label">Maximum by savings</div><div class="ec-value">KES ${(eligibleSavings*3).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div><span>3×</span></div>
                            <div class="eligibility-card"><div><div class="ec-label">Repayment position</div><div class="ec-value">${activeLoan?'KES '+activeBalance.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})+' outstanding':'No active loan balance'}</div></div><span>${activeLoan?'🔄':'✓'}</span></div>
                        </div>
                        <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                            ${eligible?'<button class="btn-primary" onclick="showLoanModal()"><i class="fas fa-hand-holding-usd"></i> Apply for Loan</button>':''}
                            ${activeLoan?'<button class="btn-primary" onclick="showRepaymentModal(\''+activeLoan.id+'\','+activeBalance.toFixed(2)+')"><i class="fas fa-money-check-dollar"></i> Repay Loan</button>':''}
                            ${activeLoan?'<button class="btn-outline" onclick="navigateTo(\'repayments\')"><i class="fas fa-history"></i> Repayment History</button>':''}
                            ${!eligible && !activeLoan && savingsMonths<3?'<span style="font-size:12px;color:var(--gray-500);">Continue saving consistently until you have activity in at least 3 distinct months.</span>':''}
                        </div>
                    </div>`;
                if (member.is_active && (loans.length || Number(member.loan_growth_score||0) > 0)) {
                    try { const growth = await callServer('getLoanGrowthStatus', {memberId: memberId, actorId: memberId}); if(growth.success && growth.hasEvaluation) html += renderLoanGrowthStatus(growth); } catch(e) {}
                }
                html += `<div class="section-card"><div class="section-title"><i class="fas fa-clock-rotate-left"></i> Loan History</div>
                    ${loans.length?loans.map(loan=>{const paid=Number(loan.amount_paid||0), total=Number(loan.total_repayment||loan.amount||0), rem=Math.max(0,total-paid);return `<div class="loan-item ${loan.status}"><div class="loan-info"><div class="amount">KES ${Number(loan.amount||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="details">${loan.repayment_period||'Repayment period'} • Applied ${new Date(loan.application_date||loan.created_at).toLocaleDateString()} ${loan.repayment_due_date?'• Due '+new Date(loan.repayment_due_date).toLocaleDateString():''} • Paid KES ${paid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})} • Balance KES ${rem.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div><span class="loan-status ${loan.status}">${loan.is_fully_paid?'Completed':loan.status}</span></div>`;}).join(''):'<div class="empty-state"><i class="fas fa-hand-holding-usd"></i><p>No loan applications yet.</p></div>'}
                </div></div>`;
                document.getElementById('dashboardContent').innerHTML=html;
            } catch(error){ showToast('Error loading loans: '+error.message,'error'); }
        }
        async function loadTransactions() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) {
                    showToast('Could not load transactions', 'error');
                    return;
                }

                const member = result.profile;
                let transactions = result.transactions || [];

                if (transactions.length < 50) {
                    try {
                        const moreResult = await callServer('getAllMemberTransactions', { 
                            memberId: memberId, actorId: memberId, 
                            limit: 100 
                        });
                        if (moreResult.success && moreResult.transactions) {
                            transactions = moreResult.transactions;
                        }
                    } catch (e) {}
                }

                transactions.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });

                const totalCount = transactions.length;

                let totalSavings = 0;
                let totalWithdrawals = 0;
                let totalRepayments = 0;
                let totalDisbursements = 0;
                let pendingCount = 0;

                transactions.forEach(t => {
                    if (t.type === 'savings' || t.type === 'registration') {
                        if (t.status === 'completed') totalSavings += Number(t.amount || 0);
                    }
                    if (t.type === 'withdrawal' && t.status === 'completed') {
                        totalWithdrawals += Number(t.amount || 0);
                    }
                    if (t.type === 'loan_repayment' && t.status === 'completed') {
                        totalRepayments += Number(t.amount || 0);
                    }
                    if (t.type === 'loan_disbursement' && t.status === 'completed') {
                        totalDisbursements += Number(t.amount || 0);
                    }
                    if (t.status === 'pending') pendingCount++;
                });

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-exchange-alt" style="color:var(--primary);"></i> All Transactions</h2>
                                <span style="font-size:13px; color:var(--gray-500);">Balance: KES ${(member.savings_balance || 0).toFixed(2)}</span>
                            </div>

                            <div class="metrics-grid" style="margin-bottom:16px;">
                                <div class="metric-card">
                                    <div class="metric-icon green"><i class="fas fa-arrow-down"></i></div>
                                    <div class="metric-value">KES ${totalSavings.toFixed(0)}</div>
                                    <div class="metric-label">Total Savings</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon red" style="background:#FEE2E2; color:#DC2626;"><i class="fas fa-arrow-up"></i></div>
                                    <div class="metric-value">KES ${totalWithdrawals.toFixed(0)}</div>
                                    <div class="metric-label">Total Withdrawals</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon blue" style="background:#DBEAFE; color:#1D4ED8;"><i class="fas fa-hand-holding-usd"></i></div>
                                    <div class="metric-value">KES ${totalRepayments.toFixed(0)}</div>
                                    <div class="metric-label">Loan Repayments</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon orange" style="background:#FEF3C7; color:#D97706;"><i class="fas fa-clock"></i></div>
                                    <div class="metric-value">${pendingCount}</div>
                                    <div class="metric-label">Pending</div>
                                </div>
                            </div>

                            <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
                                <select id="transactionFilter" onchange="filterTransactions()" style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:1; min-width:120px;">
                                    <option value="all">All Types</option>
                                    <option value="savings">💳 Savings</option>
                                    <option value="withdrawal">🏦 Withdrawals</option>
                                    <option value="loan_disbursement">💵 Loan Disbursement</option>
                                    <option value="loan_repayment">💵 Loan Repayment</option>
                                    <option value="registration">📝 Registration Fee</option>
                                </select>
                                <select id="statusFilter" onchange="filterTransactions()" style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:1; min-width:100px;">
                                    <option value="all">All Status</option>
                                    <option value="completed">✅ Completed</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                                <input type="text" id="transactionSearch" placeholder="Search by M-Pesa code..." style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:2; min-width:150px;" onkeyup="filterTransactions()">
                            </div>
                    `;

                if (transactions.length === 0) {
                    html += `
                            <div class="empty-state">
                                <i class="fas fa-exchange-alt" style="color:var(--gray-300);"></i>
                                <p>No transactions yet</p>
                                <p style="font-size:12px; margin-top:4px;">Start saving to see your transaction history</p>
                            </div>
                        `;
                } else {
                    html += `
                            <div class="section-card" style="padding:0; overflow:hidden;">
                                <div class="table-scroll" style="padding:12px;">
                                    <table class="pro-table" id="transactionsTable">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>M-Pesa</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody id="transactionsTableBody">
                    `;

                    transactions.forEach(t => {
                        const isCredit = ['savings', 'loan_disbursement', 'registration'].includes(t.type);
                        const typeDisplay = {
                            'savings': '💳 Savings',
                            'registration': '📝 Registration Fee',
                            'loan_disbursement': '💵 Loan Disbursement',
                            'loan_repayment': '💵 Loan Repayment',
                            'withdrawal': '🏦 Withdrawal'
                        } [t.type] || t.type;

                        const statusDisplay = t.status === 'pending' ? '⏳ Pending' : 
                                             t.status === 'completed' ? '✅ Completed' : 
                                             '❌ Rejected';
                        const statusClass = t.status === 'pending' ? 'pending' : 
                                            t.status === 'completed' ? 'completed' : 'rejected';

                        html += `
                                <tr data-type="${t.type}" data-status="${t.status}" data-search="${t.mpesa_code || ''}">
                                    <td>${typeDisplay}</td>
                                    <td>
                                        ${isCredit ? '+' : '-'} KES ${(t.amount || 0).toFixed(2)}
                                    </td>
                                    <td>${t.mpesa_code || 'N/A'}</td>
                                    <td><span class="type-badge ${statusClass}">${statusDisplay}</span></td>
                                    <td>${new Date(t.created_at).toLocaleString()}</td>
                                </tr>
                            `;
                    });

                    html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style="margin-top:8px; font-size:12px; color:var(--gray-400); text-align:right;">
                                Showing ${transactions.length} transactions
                            </div>
                        `;
                }

                html += `
                            <div style="margin-top:20px;">
                                <button class="btn-outline" onclick="navigateTo('dashboard')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                                </button>
                                ${transactions.length > 0 ? `<button class="btn-sm btn-info" onclick="refreshTransactions()" style="margin-left:10px; background:#3B82F6; color:white; padding:10px 16px;">
                                    <i class="fas fa-sync-alt"></i> Refresh
                                </button>` : ''}
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading transactions: ' + error.message, 'error');
            }
        }
        function filterTransactions() {
            const typeFilter = document.getElementById('transactionFilter')?.value || 'all';
            const statusFilter = document.getElementById('statusFilter')?.value || 'all';
            const searchFilter = document.getElementById('transactionSearch')?.value?.toLowerCase() || '';
            
            const tbody = document.getElementById('transactionsTableBody');
            if (!tbody) return;
            
            const rows = tbody.getElementsByTagName('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row) continue;
                
                const type = row.dataset.type || '';
                const status = row.dataset.status || '';
                const search = row.dataset.search || '';
                
                const showByType = typeFilter === 'all' || type === typeFilter;
                const showByStatus = statusFilter === 'all' || status === statusFilter;
                const showBySearch = searchFilter === '' || search.toLowerCase().includes(searchFilter);
                
                row.style.display = showByType && showByStatus && showBySearch ? '' : 'none';
            }
        }
        async function refreshTransactions() {
            showToast('Refreshing transactions...', 'info');
            await loadTransactions();
            showToast('Transactions refreshed!', 'success');
        }
        async function loadAdminTransactions() {
            const memberId = getCanonicalMemberId();
            if (!memberId) {
                showToast('Please login first', 'error');
                return;
            }

            const role = sessionStorage.getItem('memberRole');
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            const hasAccess = role === 'super_admin' || role === 'admin' || permissions.view_transactions === true || permissions.view_reports === true || permissions.view_savings === true;

            if (!hasAccess) {
                showToast('You do not have permission to view all transactions', 'error');
                navigateTo('dashboard');
                return;
            }

            try {
                document.getElementById('dashboardContent').innerHTML = `
                    <div class="dashboard-body">
                        <div style="text-align:center; padding:40px;">
                            <i class="fas fa-spinner fa-spin" style="font-size:32px; color:var(--primary);"></i>
                            <p style="margin-top:10px; color:var(--gray-500);">Loading all transactions...</p>
                        </div>
                    </div>
                `;
                const responses = await Promise.all([
                    callServer('getAllTransactionsForAdmin', {memberId: memberId, limit: 50000, offset: 0}, {force:true}),
                    callServer('getAllMembers', {}, {force:false})
                ]);
                const result = responses[0];
                const memberDirectory = (responses[1] && responses[1].success && Array.isArray(responses[1].members)) ? responses[1].members : [];
                const memberById = new Map(memberDirectory.map(function(m){ return [String(m.id||m.uuid||''),m]; }));
                const summary = result && result.summary ? result.summary : null;

                if (!result || !result.success) {
                    showToast('Error loading transactions: ' + (result?.message || 'Unknown error'), 'error');
                    document.getElementById('dashboardContent').innerHTML = `
                        <div class="dashboard-body">
                            <div style="text-align:center; padding:40px;">
                                <i class="fas fa-exclamation-circle" style="font-size:32px; color:var(--danger);"></i>
                                <p style="margin-top:10px; color:var(--gray-500);">Error loading transactions. Please try again.</p>
                                <button class="btn-primary" onclick="loadAdminTransactions()" style="margin-top:20px; width:auto; padding:10px 30px;">
                                    <i class="fas fa-sync-alt"></i> Retry
                                </button>
                                <button class="btn-outline" onclick="navigateTo('admin')" style="margin-top:10px; width:auto; padding:10px 30px;">
                                    Back to Admin
                                </button>
                            </div>
                        </div>
                    `;
                    return;
                }

                const transactions = result.transactions || [];
                const totalCount = result.totalCount || 0;

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-exchange-alt" style="color:var(--primary);"></i> All Member Transactions</h2>
                                <span style="font-size:13px; color:var(--gray-500);">${totalCount} total transactions</span>
                            </div>
                `;
                if (summary) {
                    html += `
                            <div class="metrics-grid" style="margin-bottom:16px;">
                                <div class="metric-card">
                                    <div class="metric-icon green"><i class="fas fa-arrow-down"></i></div>
                                    <div class="metric-value">KES ${(summary.totalSavings || 0).toFixed(0)}</div>
                                    <div class="metric-label">Total Savings</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon red" style="background:#FEE2E2; color:#DC2626;"><i class="fas fa-arrow-up"></i></div>
                                    <div class="metric-value">KES ${(summary.totalWithdrawals || 0).toFixed(0)}</div>
                                    <div class="metric-label">Total Withdrawals</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon blue" style="background:#DBEAFE; color:#1D4ED8;"><i class="fas fa-hand-holding-usd"></i></div>
                                    <div class="metric-value">KES ${(summary.totalRepayments || 0).toFixed(0)}</div>
                                    <div class="metric-label">Loan Repayments</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon orange" style="background:#FEF3C7; color:#D97706;"><i class="fas fa-clock"></i></div>
                                    <div class="metric-value">${summary.pendingCount || 0}</div>
                                    <div class="metric-label">Pending</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon purple"><i class="fas fa-check-circle"></i></div>
                                    <div class="metric-value">${summary.completedCount || 0}</div>
                                    <div class="metric-label">Completed</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon red" style="background:#FEE2E2; color:#DC2626;"><i class="fas fa-times-circle"></i></div>
                                    <div class="metric-value">${summary.rejectedCount || 0}</div>
                                    <div class="metric-label">Rejected</div>
                                </div>
                            </div>
                        `;
                }
                html += `
                            <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
                                <select id="adminTransFilter" onchange="filterAdminTransactions()" style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:1; min-width:120px;">
                                    <option value="all">All Types</option>
                                    <option value="savings">💳 Savings</option>
                                    <option value="withdrawal">🏦 Withdrawals</option>
                                    <option value="loan_disbursement">💵 Loan Disbursement</option>
                                    <option value="loan_repayment">💵 Loan Repayment</option>
                                    <option value="registration">📝 Registration Fee</option>
                                </select>
                                <select id="adminStatusFilter" onchange="filterAdminTransactions()" style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:1; min-width:100px;">
                                    <option value="all">All Status</option>
                                    <option value="completed">✅ Completed</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                                <input type="text" id="adminTransSearch" placeholder="Search by member reference or M-Pesa..." style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; flex:2; min-width:150px;" onkeyup="filterAdminTransactions()">
                            </div>
                    `;

                if (transactions.length === 0) {
                    html += `
                            <div class="empty-state">
                                <i class="fas fa-exchange-alt" style="color:var(--gray-300);"></i>
                                <p>No transactions found</p>
                            </div>
                        `;
                } else {
                    html += `
                            <div class="section-card" style="padding:0; overflow:hidden;">
                                <div class="table-scroll" style="padding:12px;">
                                    <table class="pro-table" id="adminTransTable">
                                        <thead>
                                            <tr>
                                                <th>Member Number</th>
                                                <th>Member Name</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>M-Pesa</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody id="adminTransTableBody">
                    `;

                    for (var i = 0; i < transactions.length; i++) {
                        var t = transactions[i];
                        var isCredit = ['savings', 'loan_disbursement', 'registration'].includes(t.type);
                        var typeDisplay = {
                            'savings': '💳 Savings',
                            'registration': '📝 Registration Fee',
                            'loan_disbursement': '💵 Loan Disbursement',
                            'loan_repayment': '💵 Loan Repayment',
                            'withdrawal': '🏦 Withdrawal'
                        } [t.type] || t.type;

                        var statusDisplay = t.status === 'pending' ? '⏳ Pending' : 
                                             t.status === 'completed' ? '✅ Completed' : 
                                             '❌ Rejected';
                        var statusClass = t.status === 'pending' ? 'pending' : 
                                            t.status === 'completed' ? 'completed' : 'rejected';
                        var directoryMember = memberById.get(String(t.member_id||'')) || {};
                        var displayNumber = directoryMember.unique_member_id || directoryMember.member_number || (!isUuidLike_(t.member_id_display) ? t.member_id_display : '—');
                        var displayName = directoryMember.full_name || t.member_name || 'Unknown Member';

                        html += `
                                <tr data-type="${t.type || ''}" data-status="${t.status || ''}" data-search="${(displayNumber || '') + ' ' + displayName + ' ' + (t.mpesa_code || '') + ' ' + (t.type || '')}">
                                    <td>
                                        <div>${displayNumber || '—'}</div>
                                    </td>
                                    <td>
                                        <div>${displayName}</div>
                                    </td>
                                    <td>${typeDisplay}</td>
                                    <td>
                                        ${isCredit ? '+' : '-'} KES ${(t.amount || 0).toFixed(2)}
                                    </td>
                                    <td>${t.mpesa_code || 'N/A'}</td>
                                    <td><span class="type-badge ${statusClass}">${statusDisplay}</span></td>
                                    <td>${new Date(t.created_at).toLocaleString()}</td>
                                </tr>
                            `;
                    }

                    html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style="margin-top:8px; font-size:12px; color:var(--gray-400); text-align:right;">
                                Showing ${transactions.length} of ${totalCount} transactions
                                ${totalCount > 0 ? '<br><span style="font-size:11px;">Complete organization transaction ledger</span>' : ''}
                            </div>
                        `;
                }

                html += `
                            <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
                                <button class="btn-outline" onclick="navigateTo('admin')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Admin
                                </button>
                                <button class="btn-sm btn-info" onclick="refreshAdminTransactions()" style="background:#3B82F6; color:white; padding:10px 16px;">
                                    <i class="fas fa-sync-alt"></i> Refresh
                                </button>
                                <button class="btn-sm btn-success" onclick="exportAdminTransactions()" style="background:#10B981; color:white; padding:10px 16px;">
                                    <i class="fas fa-download"></i> Export
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                console.error('Error loading admin transactions:', error);
                showToast('Error loading transactions: ' + (error.message || 'Unknown error'), 'error');
                document.getElementById('dashboardContent').innerHTML = `
                    <div class="dashboard-body">
                        <div style="text-align:center; padding:40px;">
                            <i class="fas fa-exclamation-circle" style="font-size:32px; color:var(--danger);"></i>
                            <p style="margin-top:10px; color:var(--gray-500);">Error loading transactions. Please try again.</p>
                            <button class="btn-primary" onclick="loadAdminTransactions()" style="margin-top:20px; width:auto; padding:10px 30px;">
                                <i class="fas fa-sync-alt"></i> Retry
                            </button>
                            <button class="btn-outline" onclick="navigateTo('admin')" style="margin-top:10px; width:auto; padding:10px 30px;">
                                Back to Admin
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        function filterAdminTransactions() {
            const typeFilter = document.getElementById('adminTransFilter')?.value || 'all';
            const statusFilter = document.getElementById('adminStatusFilter')?.value || 'all';
            const searchFilter = document.getElementById('adminTransSearch')?.value?.toLowerCase() || '';
            
            const tbody = document.getElementById('adminTransTableBody');
            if (!tbody) return;
            
            const rows = tbody.getElementsByTagName('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row) continue;
                
                const type = row.dataset.type || '';
                const status = row.dataset.status || '';
                const search = row.dataset.search || '';
                
                const showByType = typeFilter === 'all' || type === typeFilter;
                const showByStatus = statusFilter === 'all' || status === statusFilter;
                const showBySearch = searchFilter === '' || search.toLowerCase().includes(searchFilter);
                
                row.style.display = showByType && showByStatus && showBySearch ? '' : 'none';
            }
        }
        async function refreshAdminTransactions() {
            showToast('Refreshing transactions...', 'info');
            await loadAdminTransactions();
            showToast('Transactions refreshed!', 'success');
        }
        function exportAdminTransactions() {
            const table = document.getElementById('adminTransTable');
            if (!table) {
                showToast('No data to export', 'warning');
                return;
            }
            
            let csv = 'Member ID,Member Name,Type,Amount,M-Pesa Code,Status,Date\n';
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                if (cells.length === 0) continue;
                
                const rowData = [];
                for (let j = 0; j < cells.length; j++) {
                    let text = cells[j].textContent.trim();
                    text = text.replace(/\s+/g, ' ').trim();
                    if (text.includes(',')) {
                        text = '"' + text + '"';
                    }
                    rowData.push(text);
                }
                csv += rowData.join(',') + '\n';
            }
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'transactions_export_' + new Date().toISOString().slice(0, 10) + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showToast('Export started!', 'success');
        }
        async function loadRepaymentsPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;
            try {
                const result = await callServer('getAllRepaymentsForViewer', {memberId: memberId});
                if (!result.success) throw new Error(result.message || 'Could not load repayments');
                const repayments=result.repayments||[], isOrg=result.scope==='organization', activeLoans=result.activeLoans||[];
                const totalPaid=repayments.reduce((a,r)=>a+Number(r.amount||0),0);
                let html=`<div class="dashboard-body"><div class="welcome-hero"><div><div class="welcome-kicker">Collections</div><div class="welcome-title">${isOrg?'Repayment Management':'My Repayments'}</div><div class="welcome-sub">${isOrg?'Monitor repayment activity across the organization.':'Track payments, outstanding balances and your repayment progress.'}</div></div></div>`;
                if(!isOrg && activeLoans.length){
                    const loan=activeLoans[0], total=Number(loan.total_repayment||Number(loan.amount||0)*(1+Number(loan.interest_rate||0))), paid=Number(loan.amount_paid||0), remaining=Math.max(0,total-paid), progress=total>0?Math.min(100,(paid/total)*100):0;
                    html+=`<div class="section-card" style="border-color:var(--primary);"><div class="section-title"><i class="fas fa-credit-card"></i> Active Loan Repayment</div><div class="metric-grid"><div class="metric-surface"><div class="metric-label">Original Loan</div><div class="metric-value">KES ${Number(loan.amount||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">${loan.repayment_period||''}</div></div><div class="metric-surface"><div class="metric-label">Total Due</div><div class="metric-value">KES ${total.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Principal + applicable interest</div></div><div class="metric-surface"><div class="metric-label">Paid</div><div class="metric-value">KES ${paid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">${progress.toFixed(0)}% complete</div></div><div class="metric-surface"><div class="metric-label">Balance</div><div class="metric-value">KES ${remaining.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">Due ${loan.repayment_due_date?new Date(loan.repayment_due_date).toLocaleDateString():'—'}</div></div></div><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px;"><div style="flex:1;min-width:180px;height:8px;background:var(--gray-200);border-radius:999px;overflow:hidden;"><div style="height:100%;width:${progress}%;background:var(--primary);border-radius:999px;"></div></div><button class="btn-primary" onclick="showRepaymentModal('${loan.id}',${remaining.toFixed(2)})"><i class="fas fa-money-check-dollar"></i> Make Repayment</button></div></div>`;
                }
                html+=`<div class="metric-grid"><div class="metric-surface"><div class="metric-label">Records</div><div class="metric-value">${repayments.length}</div><div class="metric-sub">Recorded repayments</div></div><div class="metric-surface"><div class="metric-label">Total Paid</div><div class="metric-value">KES ${totalPaid.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div class="metric-sub">${isOrg?'Organization total':'Your total'}</div></div></div>
                    <div class="repayment-table-container"><div class="table-header"><h3><i class="fas fa-list"></i> Repayment Ledger</h3><div class="filter-box"><select id="repaymentFilter" onchange="filterRepayments()"><option value="all">All</option><option value="completed">Completed</option><option value="active">Active</option><option value="defaulted">Defaulted</option></select><input type="date" id="repaymentDateFilter" onchange="filterRepayments()"><input type="text" id="repaymentSearch" placeholder="Search member or M-Pesa..." oninput="filterRepayments()"></div></div><div class="repayment-table-wrapper"><table class="repayment-table" id="repaymentTable"><thead><tr>${isOrg?'<th>Member Number</th><th>Member Name</th>':''}<th>Loan Amount</th><th>Amount Paid</th><th>Payment Date</th><th>Method</th><th>M-Pesa Code</th><th>Status</th></tr></thead><tbody id="repaymentTableBody">`;
                if(!repayments.length) html+=`<tr><td colspan="${isOrg?8:6}" style="text-align:center;padding:30px;color:var(--gray-400)"><i class="fas fa-history" style="font-size:32px;display:block;margin-bottom:10px"></i>No repayments found</td></tr>`;
                repayments.forEach(r=>{const status=(r.loan_status||'active').toLowerCase(),d=new Date(r.payment_date||r.created_at),member=r.members||{};const memberRef=r.member_ref||'Member Record';html+=`<tr data-status="${status}" data-date="${d.toISOString().slice(0,10)}" data-search="${String(memberRef+' '+(r.mpesa_code||'')).toLowerCase()}">${isOrg?`<td><strong>${escapeHtml(memberRef)}</strong></td><td><div class="repayment-member"><div class="avatar">${escapeHtml(String(member.name||'Member').trim().charAt(0).toUpperCase())}</div><div class="member-info"><span class="member-name">${escapeHtml(member.name||'Unknown Member')}</span></div></div></td>`:''}<td class="amount">KES ${Number(r.loan_amount||r.amount||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</td><td class="amount credit">KES ${Number(r.amount||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</td><td>${d.toLocaleDateString()}</td><td>${r.payment_method||'M-Pesa'}</td><td>${r.mpesa_code||'N/A'}</td><td><span class="loan-status ${status}">${status==='completed'?'Completed':status==='defaulted'?'Defaulted':'Recorded'}</span></td></tr>`;});
                html+=`</tbody></table></div></div></div>`;
                document.getElementById('dashboardContent').innerHTML=html;
            }catch(error){showToast('Error loading repayments: '+error.message,'error');}
        }

        async function showRepaymentModal(loanId, maxAmount) {
            const html=`<div id="repaymentModal" class="modal-overlay"><div class="modal"><div class="modal-header"><h2><i class="fas fa-money-check-dollar"></i> Make Loan Repayment</h2><button class="close-btn" onclick="closeModal('repaymentModal')"><i class="fas fa-times"></i></button></div><div class="info-box"><p>Outstanding balance: <strong>KES ${Number(maxAmount).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></p><p style="font-size:11px;color:var(--gray-500)">Enter the amount paid through the official M-Pesa channel and retain your confirmation code.</p></div><form onsubmit="submitRepayment(event,'${loanId}',${Number(maxAmount)})"><div class="form-group"><label>Repayment Amount (KES)</label><div class="input-wrapper"><i class="fas fa-money-bill-wave"></i><input type="number" id="repaymentAmount" min="1" max="${Number(maxAmount)}" step="0.01" required></div></div><p style="font-size:12px;color:var(--gray-500);margin-bottom:10px;">Repayments are collected through KCB M-Pesa STK Push. Approve the payment prompt on the phone registered to your member profile.</p><button type="button" class="btn-primary" id="kcbRepaymentBtn" style="margin-bottom:8px;" onclick="startKcbLoanRepayment('${loanId}',${Number(maxAmount)})"><i class="fas fa-mobile-screen-button"></i> Pay with KCB M-Pesa</button></form></div></div>`;
            document.body.insertAdjacentHTML('beforeend',html);
        }

        async function startKcbLoanRepayment(loanId,maxAmount) {
            const memberId=getCanonicalMemberId();
            const amount=Number(document.getElementById('repaymentAmount')?.value||0);
            const btn=document.getElementById('kcbRepaymentBtn');
            if(amount<=0 || amount>Number(maxAmount)){showToast('Enter an amount within the outstanding balance.','error');return;}
            if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Connecting to KCB...';}
            try{
                const result=await callServer('initiateKcbMpesaPayment',{memberId,actorId:memberId,amount,purpose:'loan_repayment',loanId});
                if(!result.success) throw new Error(result.message||'Could not start KCB M-Pesa repayment.');
                showToast(result.message,'success');
                closeModal('repaymentModal');
                pollKcbPaymentStatus(result.requestId,function(payment){
                    if(payment.status==='completed') showToast('KCB received your loan repayment and Brightlife has updated the loan.','success');
                    else if(payment.status==='failed') showToast('KCB loan repayment was not completed. You can try again.','error');
                    loadRepaymentsPage(); loadDashboard(true);
                });
            }catch(error){showToast('KCB repayment error: '+error.message,'error');}
            finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-mobile-screen-button"></i> Pay with KCB M-Pesa';}}
        }

        async function submitRepayment(event, loanId, maxAmount) {
            event.preventDefault();
            const memberId=getCanonicalMemberId(), amount=Number(document.getElementById('repaymentAmount').value||0), mpesaCode=String(document.getElementById('repaymentMpesaCode').value||'').trim().toUpperCase(), btn=document.getElementById('repaymentSubmitBtn');
            if(amount<=0 || amount>Number(maxAmount)){showToast('Enter an amount within the outstanding balance.','error');return;}
            if(!mpesaCode){showToast('Enter the M-Pesa confirmation code.','error');return;}
            if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Processing...';}
            try{const result=await callServer('repayLoan',{loanId,memberId,actorId:memberId,amount,mpesaCode});if(!result.success)throw new Error(result.message||'Repayment failed');showToast(result.message,'success');closeModal('repaymentModal');loadRepaymentsPage();loadDashboard(true);}catch(error){showToast('Repayment error: '+error.message,'error');if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> Submit Repayment';}}
        }
        function filterRepayments() {
            const filter=document.getElementById('repaymentFilter')?.value||'all', date=document.getElementById('repaymentDateFilter')?.value||'', q=(document.getElementById('repaymentSearch')?.value||'').toLowerCase();
            document.querySelectorAll('#repaymentTableBody tr').forEach(row=>{const status=row.dataset.status||'', showStatus=filter==='all'||status===filter, showDate=!date||row.dataset.date===date, showSearch=!q||(row.dataset.search||'').includes(q); row.style.display=(showStatus&&showDate&&showSearch)?'':'none';});
        }
        async function showBiodataModal() {
            const memberId = getCanonicalMemberId();

            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) {
                    showToast('Could not load profile data', 'error');
                    return;
                }

                const member = result.profile;
                const isFirstTime = !member.biodata_completed;
                const isActive = member.is_active;
                const regFeeStatus = member.registration_fee_status || 'pending';
                const profileEditStatus = member.profile_edit_status || 'pending';

                const isLocked = member.biodata_locked === true && member.biodata_completed === true;
                const canEdit = !isLocked || profileEditStatus === 'rejected' || profileEditStatus === 'approved';
                const hasPendingEdit = isLocked && profileEditStatus === 'pending';

                let html = `
                        <div id="biodataModal" class="modal-overlay">
                            <div class="modal">
                                <div class="modal-header">
                                    <h2>📝 ${isFirstTime ? 'Complete Your Profile' : (hasPendingEdit ? 'Profile Edit Pending' : 'Edit Profile')}</h2>
                                    <button class="close-btn" onclick="closeModal('biodataModal')"><i class="fas fa-times"></i></button>
                                </div>
                    `;

                if (isLocked && isActive) {
                    html += `
                            <div class="alert alert-info">
                                <i class="fas fa-lock"></i> 
                                <div>
                                    <strong>Profile is Complete</strong>
                                    <p style="margin-top:4px; font-size:13px;">You may edit your details and submit the changes for approval. The saved profile remains unchanged until approval.</p>
                                </div>
                            </div>
                        `;
                }

                if (member.biodata_completed && profileEditStatus === 'pending') {
                    html += `
                            <div class="alert alert-warning">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <strong>Profile Edit Pending Approval</strong>
                                    <p style="margin-top:4px; font-size:13px;">Your profile changes are pending admin approval. You will be notified once approved.</p>
                                </div>
                            </div>
                        `;
                }

                if (member.biodata_completed && profileEditStatus === 'rejected') {
                    html += `
                            <div class="alert alert-error">
                                <i class="fas fa-times-circle"></i>
                                <div>
                                    <strong>Profile Edit Rejected</strong>
                                    <p style="margin-top:4px; font-size:13px;">Your profile changes were rejected. Please make corrections and resubmit.</p>
                                </div>
                            </div>
                        `;
                }

                if (isLocked && !isActive && regFeeStatus === 'pending') {
                    html += `
                            <div class="alert alert-warning">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <strong>Registration Fee Pending Approval</strong>
                                    <p style="margin-top:4px; font-size:13px;">Your profile is complete. Admin is reviewing your registration fee.</p>
                                </div>
                            </div>
                        `;
                }

                if (isLocked && !isActive && regFeeStatus === 'rejected') {
                    html += `
                            <div class="alert alert-error">
                                <i class="fas fa-times-circle"></i>
                                <div>
                                    <strong>Registration Fee Rejected</strong>
                                    <p style="margin-top:4px; font-size:13px;">Your payment was rejected. Please resubmit.</p>
                                    <button class="btn-primary" onclick="closeModal('biodataModal'); showSavingsModal();" style="margin-top:10px; padding:10px 20px; width:auto; background:#DC2626;">
                                        <i class="fas fa-redo"></i> Resubmit Payment
                                    </button>
                                </div>
                            </div>
                        `;
                }

                if (!hasPendingEdit && (isFirstTime || canEdit)) {
                    html += `
                            <form onsubmit="updateBiodata(event, ${isFirstTime})">
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-user"></i>
                                        <input type="text" id="biodataName" value="${member.full_name || ''}" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="biodataPhone" value="${member.phone_number || ''}" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-envelope"></i>
                                        <input type="email" id="biodataEmail" value="${member.email || ''}">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Occupation</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-briefcase"></i>
                                        <input type="text" id="biodataOccupation" value="${member.occupation || ''}" placeholder="Your occupation">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Address</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-home"></i>
                                        <input type="text" id="biodataAddress" value="${member.address || ''}" placeholder="Your address">
                                    </div>
                                </div>
                                <div style="border-top:1px solid var(--gray-200); padding-top:16px; margin-top:8px;">
                                    <h4 style="font-size:14px; font-weight:600; color:var(--gray-700); margin-bottom:12px;">Next of Kin</h4>
                                </div>
                                <div class="form-group">
                                    <label>Next of Kin Name</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-user-friends"></i>
                                        <input type="text" id="biodataNextOfKin" value="${member.next_of_kin || ''}" placeholder="Full name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Next of Kin Phone</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="biodataNextOfKinPhone" value="${member.next_of_kin_phone || ''}" placeholder="0712345678">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Next of Kin Relationship</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-heart"></i>
                                        <input type="text" id="biodataNextOfKinRelation" value="${member.next_of_kin_relation || ''}" placeholder="e.g., Spouse, Parent, Sibling">
                                    </div>
                                </div>
                                <div style="background:var(--gray-50); padding:12px; border-radius:var(--radius-xs); margin-bottom:16px; font-size:13px; color:var(--gray-600);">
                                    <p><strong>ID:</strong> ${member.id_number}</p>
                                    <p><strong>Member Number:</strong> ${member.unique_member_id}</p>
                                    ${!isFirstTime ? `<p style="color:var(--warning);"><i class="fas fa-clock"></i> Changes will be sent for admin approval and will not replace the current profile until approved.</p>` : ''}
                                    ${isFirstTime ? `<p style="color:var(--primary);"><i class="fas fa-info-circle"></i> After saving, you can pay KES 500 registration fee.</p>` : ''}
                                </div>
                                
                                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                    ${isFirstTime ? `
                                        <button type="button" class="btn-secondary" onclick="closeModal('biodataModal'); showSavingsModal();" style="flex:1; min-width:120px; background:#F59E0B;">
                                            <i class="fas fa-money-bill-wave"></i> Pay Registration Fee
                                        </button>
                                    ` : ''}
                                    <button type="submit" class="btn-primary" style="flex:1; min-width:120px;">
                                        <i class="fas fa-save"></i> ${isFirstTime ? 'Save Profile' : 'Submit Changes'}
                                    </button>
                                </div>
                                <button type="button" class="btn-outline" onclick="closeModal('biodataModal')" style="margin-top:10px;">Cancel</button>
                            </form>
                        `;
                } else if (hasPendingEdit) {
                    html += `
                            <div class="info-box">
                                <p><strong>Name:</strong> ${member.full_name}</p>
                                <p><strong>Phone:</strong> ${member.phone_number}</p>
                                <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
                                <p><strong>Occupation:</strong> ${member.occupation || 'N/A'}</p>
                                <p><strong>Address:</strong> ${member.address || 'N/A'}</p>
                                <p><strong>Next of Kin:</strong> ${member.next_of_kin || 'N/A'}</p>
                                <p><strong>Next of Kin Phone:</strong> ${member.next_of_kin_phone || 'N/A'}</p>
                                <p><strong>Relationship:</strong> ${member.next_of_kin_relation || 'N/A'}</p>
                            </div>
                            <button type="button" class="btn-outline" onclick="closeModal('biodataModal')">Close</button>
                        `;
                }

                html += `
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function updateBiodata(event, isFirstTime) {
            event.preventDefault();
            const memberId = getCanonicalMemberId();

            const data = {
                fullName: document.getElementById('biodataName').value,
                phoneNumber: document.getElementById('biodataPhone').value,
                email: document.getElementById('biodataEmail').value,
                occupation: document.getElementById('biodataOccupation').value,
                address: document.getElementById('biodataAddress').value,
                nextOfKin: document.getElementById('biodataNextOfKin').value,
                nextOfKinPhone: document.getElementById('biodataNextOfKinPhone').value,
                nextOfKinRelation: document.getElementById('biodataNextOfKinRelation').value
            };

            try {
                const result = await callServer('updateBiodata', { memberId: memberId, actorId: memberId, data: data, isFirstTime: isFirstTime });
                if (result.success) {
                    showToast(result.message, 'success');
                    sessionStorage.setItem('biodataCompleted', 'true');

                    const profileResult = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                    if (profileResult.success) {
                        sessionStorage.setItem('profileEditStatus', profileResult.profile.profile_edit_status || 'pending');
                        sessionStorage.setItem('isActive', profileResult.profile.is_active);
                        sessionStorage.setItem('registrationFeeStatus', profileResult.profile.registration_fee_status ||
                            'pending');
                    }

                    closeModal('biodataModal');

                    if (isFirstTime) {
                        setTimeout(() => {
                            showConfirmDialog(
                                '🎉 Profile Saved!',
                                'Would you like to pay the KES 500 registration fee now to activate your account?',
                                'success',
                                function() {
                                    showSavingsModal();
                                },
                                'Yes, Pay Now'
                            );
                        }, 500);
                    } else {
                        showToast('✅ Profile changes submitted for admin approval. You will be notified once approved.',
                            'success');
                    }
                    loadDashboard();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showSavingsModal() {
            const memberId = getCanonicalMemberId();
            if (!memberId) { showToast('Please sign in again.', 'error'); return; }
            const isActive = sessionStorage.getItem('isActive') === 'true';
            const biodataCompleted = sessionStorage.getItem('biodataCompleted') === 'true';
            const registrationFeeStatus = sessionStorage.getItem('registrationFeeStatus') || 'pending';
            const profilePhone = (typeof currentUser !== 'undefined' && currentUser && (currentUser.phoneNumber || currentUser.phone_number)) || (window.currentUser && (window.currentUser.phoneNumber || window.currentUser.phone_number)) || sessionStorage.getItem('phoneNumber') || '';

            const isRegistration = biodataCompleted && !isActive && registrationFeeStatus !== 'approved';
            const defaultAmount = isRegistration ? 500 : 100;
            const title = isRegistration ? '💰 Pay Registration Fee' : '💰 Deposit Savings';
            const buttonText = isRegistration ? 'Pay & Submit for Approval' : 'Submit Deposit';

            const html = `
                    <div id="savingsModal" class="modal-overlay">
                        <div class="modal">
                            <div class="modal-header">
                                <h2>${title}</h2>
                                <button class="close-btn" onclick="closeModal('savingsModal')"><i class="fas fa-times"></i></button>
                            </div>
                            ${isRegistration ? `
                                <div class="alert alert-warning" style="background: #FEF3C7; border-color: #FDE68A; color: #92400E;">
                                    <i class="fas fa-info-circle"></i> Pay KES 500 registration fee to activate your account. After admin approval, you'll have full access to all features.
                                </div>
                            ` : ''}
                            <form onsubmit="processSavings(event)">
                                <div class="form-group">
                                    <label>M-Pesa Phone Number</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="savingsPhone" value="${profilePhone}" readonly>
                                    </div>
                                    <div style="font-size:11px;color:var(--gray-500);margin-top:5px;">
                                        <i class="fas fa-shield-halved"></i> KCB M-Pesa will use the phone number saved in your member profile. To change it, edit your profile first.
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Amount (KES)</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-money-bill-wave"></i>
                                        <input type="number" id="savingsAmount" min="${isRegistration ? 500 : 1}" value="${defaultAmount}" ${isRegistration ? 'readonly' : ''} required>
                                        ${isRegistration ? `<span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--gray-500);">Registration Fee</span>` : ''}
                                    </div>
                                </div>
                                ${!isRegistration ? `<div class="form-group">
                                    <label>M-Pesa Code <span style="font-weight:400;color:var(--gray-500);">(manual savings deposit only)</span></label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-mobile-alt"></i>
                                        <input type="text" id="mpesaCode" placeholder="Enter confirmation code for manual payment">
                                        <div style="font-size: 11px; color: var(--gray-500); margin-top: 4px;">
                                            <i class="fas fa-info-circle"></i> Leave this blank when using KCB M-Pesa. KCB will send an STK prompt to your saved phone number.
                                        </div>
                                    </div>
                                </div>` : ''}
                                ${!isRegistration ? `<div class="mpesa-info">
                                    <p><i class="fas fa-mobile-alt" style="color:var(--primary);"></i> Paybill: <span class="highlight">247247</span></p>
                                    <p>Account: <span class="highlight">0960179935983</span></p>
                                    <p style="font-size: 11px; color: var(--gray-500); margin-top: 4px;">Manual savings deposits require verification and admin approval.</p>
                                </div>` : ''}
                                <button type="button" class="btn-primary" style="margin-bottom:8px;" onclick="startKcbSavingsPayment(${isRegistration ? 'true' : 'false'})"><i class="fas fa-mobile-screen-button"></i> ${isRegistration ? 'Pay Registration Fee with KCB M-Pesa' : 'Pay with KCB M-Pesa'}</button>
                                ${!isRegistration ? `<button type="submit" class="btn-outline"><i class="fas fa-keyboard"></i> ${buttonText} Manually</button>` : `<p style="font-size:12px;color:var(--gray-500);margin-top:8px;">Registration fees are accepted only through KCB M-Pesa STK Push. Approve the prompt on your registered phone.</p>`}
                                <button type="button" class="btn-outline" onclick="closeModal('savingsModal')" style="margin-top:10px;">Cancel</button>
                            </form>
                        </div>
                    </div>
                `;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        async function startKcbSavingsPayment(isRegistration) {
            const memberId=getCanonicalMemberId();
            const amount=Number(document.getElementById('savingsAmount')?.value||0);
            if(!memberId || !amount){showToast('Enter a valid payment amount.','error');return;}
            const btn=document.querySelector('#savingsModal button[onclick^="startKcbSavingsPayment"]');
            if(btn){btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Connecting to KCB...';}
            try{
                const result=await callServer('initiateKcbMpesaPayment',{memberId,actorId:memberId,amount,purpose:isRegistration?'registration':'savings'});
                if(!result.success) throw new Error(result.message||'Could not start KCB M-Pesa payment.');
                showToast(result.message,'success');
                closeModal('savingsModal');
                pollKcbPaymentStatus(result.requestId, function(payment){
                    if(payment.status==='completed') showToast(payment.purpose==='registration'?'KCB received the registration fee. It is awaiting admin approval.':'KCB received your savings payment. It is awaiting admin approval.','success');
                    else if(payment.status==='failed') showToast('KCB payment was not completed. You can try again.','error');
                    loadDashboard(true);
                });
            }catch(error){showToast('KCB payment error: '+error.message,'error');}
            finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fas fa-mobile-screen-button"></i> Pay with KCB M-Pesa';}}
        }

        async function pollKcbPaymentStatus(requestId,onDone) {
            const memberId=getCanonicalMemberId();
            let attempts=0;
            const check=async()=>{
                attempts++;
                try{
                    const result=await callServer('getKcbPaymentStatus',{requestId,memberId,actorId:memberId},{force:true});
                    const status=result&&result.payment?String(result.payment.status||'').toLowerCase():'';
                    if(['completed','failed','cancelled'].indexOf(status)>=0 || attempts>=12){if(onDone) onDone(result.payment||{});return;}
                }catch(e){if(attempts>=12){if(onDone) onDone({status:'pending'});return;}}
                setTimeout(check,5000);
            };
            setTimeout(check,2000);
        }

        async function processSavings(event) {
            event.preventDefault();
            const memberId = getCanonicalMemberId();
            const amount = parseFloat(document.getElementById('savingsAmount').value);
            const mpesaCode = document.getElementById('mpesaCode').value;

            if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
            if (!mpesaCode) { showToast('Please enter the M-Pesa confirmation code', 'error'); return; }

            try {
                const checkResult = await callServer('checkMpesaCode', { mpesaCode: mpesaCode });
                if (checkResult.exists) {
                    showToast('This M-Pesa code has already been used. Please enter a different code.', 'error');
                    return;
                }
            } catch (error) {
                showToast('Error checking M-Pesa code: ' + error.message, 'error');
                return;
            }

            try {
                const result = await callServer('processSavings', { memberId, actorId: memberId, amount, mpesaCode });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('savingsModal');

                    const profileResult = await callServer('getMemberProfile', { memberId, actorId: getCanonicalMemberId() });
                    if (profileResult.success) {
                        sessionStorage.setItem('isActive', profileResult.profile.is_active);
                        sessionStorage.setItem('registrationFeePaid', profileResult.profile.registration_fee_paid);
                        sessionStorage.setItem('registrationFeeStatus', profileResult.profile.registration_fee_status ||
                            'pending');
                        sessionStorage.setItem('biodataCompleted', profileResult.profile.biodata_completed);
                    }
                    loadDashboard();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showWithdrawalModal() {
            const memberId = getCanonicalMemberId();
            callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() }).then(result => {
                if (!result.success) {
                    showToast('Could not load member data', 'error');
                    return;
                }

                const member = result.profile;
                const profilePhone = String(member.phone_number || '').trim();
                const totalSavings = member.savings_balance || 0;
                const withdrawalFee = member.withdrawal_fee || 0.2;
                const regFeeAmount = 500;
                const withdrawable = Math.max(0, totalSavings);

                const html = `
                        <div id="withdrawalModal" class="modal-overlay">
                            <div class="modal">
                                <div class="modal-header">
                                    <h2>🏦 Request Withdrawal</h2>
                                    <button class="close-btn" onclick="closeModal('withdrawalModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <form onsubmit="requestWithdrawal(event)">
                                    <div class="info-box">
                                        <p>Total Savings: <strong>KES ${totalSavings.toFixed(2)}</strong></p>
                                        <p>Available for Withdrawal: <strong class="highlight">KES ${withdrawable.toFixed(2)}</strong></p>
                                    </div>
                                    <div class="form-group">
                                        <label>Amount to Withdraw (KES)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-money-bill-wave"></i>
                                            <input type="number" id="withdrawalAmount" min="1" max="${withdrawable}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>M-Pesa Number</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-phone"></i>
                                            <input type="tel" id="withdrawalPhone" value="${member.phone_number || ''}" readonly required>
                                        </div>
                                        <div style="font-size:11px;color:var(--gray-500);margin-top:5px;">
                                            <i class="fas fa-lock"></i> This is the M-Pesa number on your member profile. Change it from <strong>My Profile</strong> if necessary.
                                        </div>
                                    </div>
                                    <div style="background:#FEF3C7; padding:10px; border-radius:8px; margin-bottom:16px; font-size:12px; color:#92400E;">
                                        <i class="fas fa-info-circle"></i> Withdrawal requests are sent to admin for approval. Processing takes 24-48 hours.
                                    </div>
                                    <button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Request Withdrawal</button>
                                    <button type="button" class="btn-outline" onclick="closeModal('withdrawalModal')" style="margin-top:10px;">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            }).catch(error => {
                showToast('Error: ' + error.message, 'error');
            });
        }

        async function requestWithdrawal(event) {
            event.preventDefault();
            const memberId = getCanonicalMemberId();
            const amount = parseFloat(document.getElementById('withdrawalAmount').value);
            const phone = document.getElementById('withdrawalPhone').value.trim();

            if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
            if (!phone) { showToast('Your member profile does not have an M-Pesa phone number. Please update your profile.', 'error'); return; }

            try {
                const result = await callServer('requestWithdrawal', { memberId, actorId: memberId, amount });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('withdrawalModal');
                    loadSavingsPage();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showLoanModal() {
            const memberId = getCanonicalMemberId();
            callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() }).then(result => {
                if (!result.success) {
                    showToast('Could not load member data', 'error');
                    return;
                }

                const member = result.profile;
                const eligibleSavings = Number(member.eligible_savings || member.savings_balance || 0);
                const loanLimit = Number(member.loan_limit_effective || member.loan_hard_cap || 0);
                const savingsMonths = Number.isFinite(Number(member.qualifying_savings_months)) ? Number(member.qualifying_savings_months) : (Array.isArray(member.qualifying_savings_months) ? member.qualifying_savings_months.length : 0);

                const html = `
                        <div id="loanModal" class="modal-overlay">
                            <div class="modal">
                                <div class="modal-header">
                                    <h2>💳 Apply for Loan</h2>
                                    <button class="close-btn" onclick="closeModal('loanModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <form onsubmit="applyLoan(event)">
                                    <div class="info-box">
                                        <p>Your Savings: <strong>KES ${Number(member.savings_balance||0).toFixed(2)}</strong></p>
                                        <p>Eligible Savings: <strong class="highlight">KES ${eligibleSavings.toFixed(2)}</strong></p>
                                        <p>Your Effective Loan Limit: <strong class="highlight">KES ${loanLimit.toFixed(2)}</strong></p>
                                    </div>
                                    <div class="form-group">
                                        <label>M-Pesa Phone Number</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-phone"></i>
                                            <input type="tel" id="loanPhone" value="${member.phone_number || ''}" readonly>
                                        </div>
                                        <div style="font-size:11px;color:var(--gray-500);margin-top:5px;">
                                            <i class="fas fa-info-circle"></i> This is the M-Pesa number registered on your profile and will be used for loan-related notifications/disbursement setup. Edit your profile to change it.
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Loan Amount (KES)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-money-bill-wave"></i>
                                            <input type="number" id="loanAmount" min="1000" max="${loanLimit}" placeholder="Enter amount" required>
                                            <span style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 10px; color: var(--gray-400);">Max: ${loanLimit}</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Repayment Period</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-calendar-alt"></i>
                                            <select id="repaymentPeriod" required>
                                                <option value="7">Up to 7 days (12% interest)</option>
                                                <option value="14">8–14 days (16% interest)</option>
                                                <option value="20">15–20 days (18% interest)</option>
                                                <option value="30">21–30 days (20% interest)</option>
                                                
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Guarantor 1 (National ID Number)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-user-check"></i>
                                            <input type="text" id="guarantor1" placeholder="Enter National ID number" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Guarantor 2 (National ID Number)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-user-check"></i>
                                            <input type="text" id="guarantor2" placeholder="Enter National ID number" required>
                                        </div>
                                    </div>
                                    <div style="background:#FEF3C7; padding:10px; border-radius:8px; margin-bottom:16px; font-size:12px; color:#92400E;">
                                        <i class="fas fa-info-circle"></i> Loan applications are sent to admin for approval. You will be notified once approved.
                                    </div>
                                    <button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Submit Application</button>
                                    <button type="button" class="btn-outline" onclick="closeModal('loanModal')" style="margin-top:10px;">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            }).catch(error => {
                showToast('Error: ' + error.message, 'error');
            });
        }

        async function applyLoan(event) {
            event.preventDefault();
            const memberId = getCanonicalMemberId();
            const amount = parseFloat(document.getElementById('loanAmount').value);
            const repaymentDays = document.getElementById('repaymentPeriod').value;
            const loanPhone = (document.getElementById('loanPhone')?.value || '').trim();
            const guarantor1IdNumber = document.getElementById('guarantor1').value.trim();
            const guarantor2IdNumber = document.getElementById('guarantor2').value.trim();

            if (!amount || amount < 1000) { showToast('Minimum loan is KES 1,000', 'error'); return; }
            if (!loanPhone) { showToast('Your member profile must have a valid M-Pesa phone number before applying for a loan.', 'error'); return; }

            try {
                const result = await callServer('applyForLoan', {
                    memberId,
                    actorId: memberId,
                    loanData: { amount, repaymentDays, guarantor1Id: guarantor1IdNumber, guarantor2Id: guarantor2IdNumber }
                });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('loanModal');
                    loadLoansPage();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function loadMessagesPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            try {
                const result = await callServer('getMemberMessages', { memberId: memberId, actorId: memberId });
                if (!result.success) {
                    showToast('Could not load messages', 'error');
                    return;
                }

                const messages = result.messages || [];

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-comment-dots" style="color:var(--primary);"></i> My Messages</h2>
                            </div>

                            <div class="chat-container">
                                <div class="chat-header">
                                    <h3><i class="fas fa-comments" style="color:var(--primary);"></i> Messages</h3>
                                    <span style="font-size:12px; color:var(--gray-500);">${messages.length} messages</span>
                                </div>
                                <div class="chat-messages" id="chatMessagesContainer">
                    `;

                if (messages.length === 0) {
                    html += `
                            <div class="chat-empty">
                                <i class="fas fa-comment-dots" style="color:var(--gray-300);"></i>
                                <p>No messages yet. Send a message to customer care.</p>
                            </div>
                        `;
                } else {
                    messages.forEach(msg => {
                        const isSent = String(msg.sender_id || '') === String(memberId);
                        const senderName = isSent ? 'You' : (msg.sender_name || 'Customer Care');
                        const date = new Date(msg.created_at);
                        const time = isNaN(date.getTime()) ? '' : date.toLocaleString('en-KE');
                        const status = msg.status === 'replied' ? 'Replied' : msg.status === 'read' ? 'Read' : 'Sent';
                        const messageText = escapeHtml(msg.message || '');
                        const responseText = escapeHtml(msg.response || '');
                        html += `<div class="chat-message-row ${isSent ? 'member' : 'staff'}">
                            <div style="font-weight:800;margin-bottom:6px;">${escapeHtml(senderName)}</div>
                            <div style="white-space:pre-wrap;word-break:break-word;line-height:1.6;">${messageText}</div>
                            <div class="chat-meta"><span>${escapeHtml(time)}</span><span>${status}</span></div>
                            ${responseText && responseText !== messageText ? `<div class="chat-message-row staff" style="margin-top:10px;margin-bottom:0;max-width:100%;"><div style="font-weight:800;margin-bottom:6px;">Customer Care</div><div style="white-space:pre-wrap;word-break:break-word;line-height:1.6;">${responseText}</div><div class="chat-meta"><span>Official response</span><span>${msg.replied_at ? escapeHtml(new Date(msg.replied_at).toLocaleString('en-KE')) : ''}</span></div></div>` : ''}
                        </div>`;
                    });
                }

                html += `
                                </div>
                                <div class="chat-input-area">
                                    <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter'){sendNewMessage();}">
                                    <button onclick="sendNewMessage()"><i class="fas fa-paper-plane"></i> Send</button>
                                </div>
                            </div>

                            <div style="margin-top:16px;">
                                <button class="btn-outline" onclick="navigateTo('dashboard')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Dashboard
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading messages: ' + error.message, 'error');
            }
        }

        async function sendNewMessage() {
            const input = document.getElementById('messageInput');
            if (!input) return;
            const message = input.value.trim();
            if (!message) { showToast('Please enter a message', 'warning'); return; }

            const memberId = getCanonicalMemberId();

            try {
                const result = await callServer('sendCustomerCareMessage', { memberId, message });
                if (result.success) {
                    showToast('Message sent successfully!', 'success');
                    input.value = '';
                    loadMessagesPage();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function loadChatPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            const role = sessionStorage.getItem('memberRole');
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            if (role !== 'super_admin' && role !== 'admin' && !permissions.customer_care) {
                showToast('You do not have permission to access customer care chat', 'error');
                navigateTo('dashboard');
                return;
            }

            try {
                const result = await callServer('getAllCustomerMessages', { actorId: memberId });
                if (!result.success) {
                    showToast('Could not load messages: ' + (result.error || 'Unknown error'), 'error');
                    return;
                }

                const messages = result.messages || [];
                
                const memberMessages = {};
                messages.forEach(msg => {
                    const key = msg.member_id || 'unknown';
                    if (!memberMessages[key]) {
                        memberMessages[key] = [];
                    }
                    memberMessages[key].push(msg);
                });

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-headset" style="color:var(--primary);"></i> Customer Care Chat</h2>
                                <span style="font-size:13px; color:var(--gray-500);">${messages.length} messages</span>
                            </div>

                            <div class="chat-container" style="max-height: 600px;">
                                <div class="chat-header">
                                    <h3><i class="fas fa-comments" style="color:var(--primary);"></i> All Member Messages</h3>
                                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                        <span style="font-size:11px; color:var(--gray-400);">Click a message to reply</span>
                                    </div>
                                </div>
                                <div class="chat-messages" id="adminChatContainer" style="max-height: 400px;">
                    `;

                if (Object.keys(memberMessages).length === 0) {
                    html += `
                            <div class="chat-empty">
                                <i class="fas fa-comment-dots" style="color:var(--gray-300);"></i>
                                <p>No messages from members yet.</p>
                            </div>
                        `;
                } else {
                    Object.keys(memberMessages).forEach(memberIdKey => {
                        const msgs = memberMessages[memberIdKey];
                        const firstMsg = msgs[0];
                        const memberName = firstMsg.member_name || firstMsg.sender_name || 'Unknown Member';
                        const memberUniqueId = firstMsg.member_unique_id || '';
                        const unreadCount = msgs.filter(m => m.status === 'sent').length;

                        html += `
                                <div style="background:var(--gray-50); border-radius:var(--radius-xs); padding:10px 14px; margin-bottom:8px; cursor:pointer; border:1px solid var(--gray-200);" onclick="openChatReply('${memberIdKey}')">
                                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                                        <div>
                                            <div style="font-weight:600; color:var(--gray-800);">${memberName}</div>
                                            <div style="font-size:11px; color:var(--gray-500);">${memberUniqueId || 'N/A'} • ${msgs.length} messages</div>
                                        </div>
                                        ${unreadCount > 0 ? `<span style="background:var(--danger); color:white; padding:2px 10px; border-radius:20px; font-size:10px; font-weight:600;">${unreadCount} new</span>` : ''}
                                        <span style="font-size:11px; color:var(--gray-400);">${new Date(msgs[0].created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div style="font-size:12px; color:var(--gray-600); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                        ${msgs[0].message || msgs[0].response || 'No message'}
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `
                                </div>
                            </div>

                            <div style="margin-top:16px;padding:14px 16px;border:1px solid var(--gray-200);border-radius:12px;background:var(--gray-50);font-size:12px;color:var(--gray-600);line-height:1.6;">
                                <strong style="color:var(--gray-800);"><i class="fas fa-shield-alt"></i> Access policy:</strong> Administrator and Super Admin accounts have full administrative rights. Their permission switches are intentionally locked because their access is controlled by the role itself. Delegated roles can be adjusted individually by the Super Admin.
                            </div>
                            <div style="margin-top:16px;">
                                <button class="btn-outline" onclick="navigateTo('admin')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Admin
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading chat: ' + error.message, 'error');
            }
        }
        async function openChatReply(memberId) {
            try {
                const result = await callServer('getMemberMessages', { memberId, actorId: getCanonicalMemberId() }, { force: true });
                if (!result || !result.success) {
                    showToast((result && result.error) || 'Could not load member messages.', 'error');
                    return;
                }

                const messages = Array.isArray(result.messages) ? result.messages : [];
                const memberName = (result.member && result.member.name) || messages.find(m => m.member_name)?.member_name || 'Member';
                await callServer('markMessagesAsRead', { memberId, actorId: getCanonicalMemberId() });

                let html = `<div id="chatReplyModal" class="modal-overlay">
                    <div class="modal chat-reply-modal" style="max-width:900px;">
                        <div class="modal-header chat-modal-header">
                            <div><h2><i class="fas fa-comments"></i> ${escapeHtml(memberName)}</h2><div class="text-muted" style="font-size:11px;margin-top:3px;">Member conversation</div></div>
                            <button class="close-btn" onclick="closeModal('chatReplyModal')"><i class="fas fa-times"></i></button>
                        </div>
                        <div id="chatReplyMessages"></div>
                        <div class="chat-reply-composer">
                            <label for="chatReplyInput">Professional response</label>
                            <textarea id="chatReplyInput" placeholder="Write a clear and respectful response to the selected member message..." maxlength="4000" aria-label="Customer care reply"></textarea>
                            <div style="font-size:11px;color:#64748b;margin-top:6px;">Your response will be attached to the selected member message.</div>
                            <div class="chat-reply-actions"><button class="cancel" id="chatReplyCancelBtn" type="button">Cancel</button><button class="send" id="chatReplySendBtn" type="button"><i class="fas fa-paper-plane"></i> Send Reply</button></div>
                        </div>
                    </div>
                </div>`;

                document.body.insertAdjacentHTML('beforeend', html);
                const container = document.getElementById('chatReplyMessages');
                const input = document.getElementById('chatReplyInput');
                const sendButton = document.getElementById('chatReplySendBtn');
                const cancelButton = document.getElementById('chatReplyCancelBtn');
                if (cancelButton) cancelButton.addEventListener('click', function(){ closeModal('chatReplyModal'); });

                let selectedMessageId = '';
                const memberMessages = messages.filter(msg => String(msg.sender_id || '') === String(memberId));

                if (!memberMessages.length) {
                    container.innerHTML = '<div class="pro-table-empty"><i class="fas fa-comment-slash"></i>No member messages are available.</div>';
                } else {
                    container.innerHTML = memberMessages.map(msg => {
                        const hasReply = !!String(msg.response || '').trim();
                        const date = new Date(msg.created_at);
                        const dateText = isNaN(date.getTime()) ? '' : date.toLocaleString('en-KE');
                        return `<div class="chat-message-row member" data-message-id="${escapeHtml(msg.id)}">
                            <div>${escapeHtml(msg.message || '')}</div>
                            <div class="chat-meta"><span>${escapeHtml(memberName)} · ${escapeHtml(dateText)}</span><span>${hasReply ? 'Answered' : 'Awaiting reply'}</span></div>
                            ${hasReply ? `<div class="chat-message-row staff" style="margin-top:9px;margin-bottom:0;max-width:100%;"><div>${escapeHtml(msg.response)}</div><div class="chat-meta"><span>Customer Care</span><span>${msg.replied_at ? escapeHtml(new Date(msg.replied_at).toLocaleString('en-KE')) : ''}</span></div></div>` :
                            `<div class="reply-action"><button class="btn-sm btn-primary" type="button" data-reply-message="${escapeHtml(msg.id)}"><i class="fas fa-reply"></i> Reply to this message</button></div>`}
                        </div>`;
                    }).join('');

                    container.querySelectorAll('[data-reply-message]').forEach(btn => {
                        btn.addEventListener('click', function() {
                            selectedMessageId = this.getAttribute('data-reply-message') || '';
                            input.focus();
                            input.placeholder = 'Replying to this member message...';
                            container.querySelectorAll('[data-message-id]').forEach(row => row.classList.remove('selected'));
                            const row = container.querySelector('[data-message-id="' + CSS.escape(selectedMessageId) + '"]');
                            if (row) row.classList.add('selected');
                        });
                    });
                    const firstUnanswered = memberMessages.find(msg => !String(msg.response || '').trim());
                    if (firstUnanswered) {
                        selectedMessageId = firstUnanswered.id;
                    }
                }

                sendButton.addEventListener('click', async function() {
                    const message = String(input.value || '').trim();
                    if (!selectedMessageId) {
                        showToast('Select the member message you want to answer.', 'warning');
                        return;
                    }
                    if (!message) {
                        showToast('Please enter a reply message.', 'warning');
                        input.focus();
                        return;
                    }

                    sendButton.disabled = true;
                    try {
                        const response = await callServer('replyToMember', {
                            memberId,
                            messageId: selectedMessageId,
                            message,
                            actorId: getCanonicalMemberId()
                        }, { force: true });

                        if (!response || !response.success) {
                            throw new Error((response && response.message) || 'Failed to send reply.');
                        }

                        showToast(response.message || 'Reply sent successfully.', 'success');
                        closeModal('chatReplyModal');
                        await loadChatPage();
                    } catch (error) {
                        showToast(error.message || 'Failed to send reply.', 'error');
                    } finally {
                        sendButton.disabled = false;
                    }
                });

                setTimeout(function() { if (input) input.focus(); }, 80);
                if (container) container.scrollTop = container.scrollHeight;
            } catch (error) {
                showToast('Error: ' + (error.message || error), 'error');
            }
        }
        async function loadAdminDashboard(forceRefresh) {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;
            forceRefresh = !!forceRefresh;

            const role = sessionStorage.getItem('memberRole');
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            const hasAdminAccess = role === 'super_admin' || role === 'admin' || role === 'treasurer' || role === 'customer_care' || role === 'profile_approver' ||
                permissions.view_members || permissions.loan_approval ||
                permissions.savings_approval || permissions.withdrawal_approval ||
                permissions.registration_approval || permissions.grant_rights ||
                permissions.customer_care || permissions.profile_approval ||
                permissions.edit_members;

            if (!hasAdminAccess) {
                showToast('You do not have permission to access the admin dashboard', 'error');
                navigateTo('dashboard');
                return;
            }

            try {
                const cacheKey = 'brightlife_admin_dashboard';
                let result = null;
                if (!forceRefresh) {
                    try {
                        const raw = sessionStorage.getItem(cacheKey);
                        if (raw) {
                            const cached = JSON.parse(raw);
                            if (cached && cached.result && Date.now() - cached.savedAt < 10000) {
                                result = cached.result;
                                renderAdminDashboard(result, role, permissions);
                                setTimeout(function() { loadAdminDashboard(true); }, 50);
                            }
                        }
                    } catch (e) {}
                }
                if (!result) result = await callServer('forceRefreshAdminData', {memberId: memberId}, {force: true});
                if (result && result.success) {
                    try { sessionStorage.setItem(cacheKey, JSON.stringify({savedAt: Date.now(), result: result})); } catch (e) {}
                }
                if (!result.success) {
                    const regularResult = await callServer('getAdminDashboard', {memberId: memberId});
                    if (!regularResult.success) {
                        showToast('Error loading admin dashboard', 'error');
                        return;
                    }
                    renderAdminDashboard(regularResult, role, permissions);
                } else {
                    renderAdminDashboard(result, role, permissions);
                }
            } catch (error) {
                showToast('Error loading admin dashboard: ' + error.message, 'error');
            }
        }

        function renderAdminDashboard(result, role, permissions) {
            const stats = result.stats || {};
            const pendingRegistrations = result.pendingRegistrations || [];
            const pendingTransactions = result.pendingTransactions || [];
            const pendingLoans = result.pendingLoans || [];
            const pendingWithdrawals = result.pendingWithdrawals || [];
            const pendingProfileEdits = result.pendingProfileEdits || [];
            const processingPayouts = result.processingPayouts || [];
            const activeLoans = result.activeLoans || [];

            const totalPending = pendingRegistrations.length + pendingTransactions.length + pendingLoans.length +
                pendingWithdrawals.length + pendingProfileEdits.length;
            document.getElementById('pendingBadge').textContent = totalPending;
            const approvalBadge = document.getElementById('approvalBadge');
            if (approvalBadge) approvalBadge.textContent = totalPending;
            pendingCount = totalPending;

            let html = `
                    <div class="dashboard-body">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                            <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-shield-alt" style="color:var(--primary);"></i> Admin Dashboard</h2>
                            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                <span style="font-size:12px; color:var(--gray-500);">${new Date().toLocaleDateString()}</span>
                                <button class="btn-sm btn-info" onclick="refreshAdminDashboard()" style="background:#3B82F6; color:white; padding:6px 12px;">
                                    <i class="fas fa-sync-alt"></i> Refresh
                                </button>
                            </div>
                        </div>

                        <div style="background: var(--primary-gradient); border-radius: var(--radius-sm); padding: 20px 24px; color: white; margin-bottom: 20px; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -50%; right: -10%; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; position: relative; z-index: 1;">
                                <div>
                                    <div style="font-size: 14px; opacity: 0.8;">Organization Pending Approvals</div>
                                    <div style="font-size: 32px; font-weight: 800;">${totalPending}</div>
                                </div>
                                <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                                    <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: var(--radius-xs); min-width: 70px;">
                                        <div style="font-size: 18px; font-weight: 700;">${pendingRegistrations.length}</div>
                                        <div style="font-size: 10px; opacity: 0.7;">Registrations</div>
                                    </div>
                                    <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: var(--radius-xs); min-width: 70px;">
                                        <div style="font-size: 18px; font-weight: 700;">${pendingTransactions.length}</div>
                                        <div style="font-size: 10px; opacity: 0.7;">Transactions</div>
                                    </div>
                                    <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: var(--radius-xs); min-width: 70px;">
                                        <div style="font-size: 18px; font-weight: 700;">${pendingLoans.length}</div>
                                        <div style="font-size: 10px; opacity: 0.7;">Loans</div>
                                    </div>
                                    <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: var(--radius-xs); min-width: 70px;">
                                        <div style="font-size: 18px; font-weight: 700;">${pendingWithdrawals.length}</div>
                                        <div style="font-size: 10px; opacity: 0.7;">Withdrawals</div>
                                    </div>
                                    <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: var(--radius-xs); min-width: 70px;">
                                        <div style="font-size: 18px; font-weight: 700;">${pendingProfileEdits.length}</div>
                                        <div style="font-size: 10px; opacity: 0.7;">Profile Edits</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-icon purple"><i class="fas fa-users"></i></div>
                                <div class="metric-value">${Number(stats.totalMembers || 0).toLocaleString()}</div>
                                <div class="metric-label">Total Members</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon green"><i class="fas fa-user-check"></i></div>
                                <div class="metric-value">${Number(stats.activeMembers || 0).toLocaleString()}</div>
                                <div class="metric-label">Active Members</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon blue"><i class="fas fa-piggy-bank"></i></div>
                                <div class="metric-value">KES ${Number(stats.totalSavings || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                <div class="metric-label">Organization Savings</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon orange"><i class="fas fa-hand-holding-usd"></i></div>
                                <div class="metric-value">KES ${Number(stats.outstandingLoanBalance || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                <div class="metric-label">Outstanding Loan Balance</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon purple"><i class="fas fa-file-invoice-dollar"></i></div>
                                <div class="metric-value">KES ${Number(stats.totalLoanPortfolio || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                <div class="metric-label">Active Loan Portfolio</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon green"><i class="fas fa-money-check-dollar"></i></div>
                                <div class="metric-value">KES ${Number(stats.totalRepayments || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                <div class="metric-label">Recorded Repayments</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon blue"><i class="fas fa-chart-line"></i></div>
                                <div class="metric-value">${Number(stats.collectionRate || 0).toFixed(1)}%</div>
                                <div class="metric-label">Repayment Collection Rate</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-icon orange"><i class="fas fa-triangle-exclamation"></i></div>
                                <div class="metric-value">${Number(stats.overdueLoans || 0)}</div>
                                <div class="metric-label">Overdue Active Loans</div>
                            </div>
                        </div>

                        <div class="section-card" style="margin-top:16px;">
                            <div class="section-title">
                                <i class="fas fa-gauge-high" style="color:var(--primary);"></i>
                                Organization Financial Position
                                <span style="margin-left:auto;font-size:11px;color:var(--gray-500);">Ledger-controlled snapshot</span>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:12px;">
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;"><div style="font-size:11px;color:var(--gray-500);">Total savings</div><div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.totalSavings||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div style="font-size:10px;color:var(--gray-400);">Posted savings less withdrawals</div></div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;"><div style="font-size:11px;color:var(--gray-500);">Loan disbursements</div><div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.loanDisbursements||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div style="font-size:10px;color:var(--gray-400);">Completed ledger entries</div></div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;"><div style="font-size:11px;color:var(--gray-500);">Loan repayments</div><div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.loanRepayments||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div style="font-size:10px;color:var(--gray-400);">Completed ledger entries</div></div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;"><div style="font-size:11px;color:var(--gray-500);">Outstanding loans</div><div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.activeLoanBalance||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div><div style="font-size:10px;color:var(--gray-400);">Contractual amount remaining</div></div>
                            </div>
                            <div style="padding:12px 14px;border-radius:10px;background:${stats.reconciliation && stats.reconciliation.overallReconciled ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)'};border:1px solid ${stats.reconciliation && stats.reconciliation.overallReconciled ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'};display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                <i class="fas ${stats.reconciliation && stats.reconciliation.overallReconciled ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                                <strong>${stats.reconciliation && stats.reconciliation.overallReconciled ? 'Ledger Reconciled' : 'Reconciliation Exception'}</strong>
                                <span style="font-size:11px;color:var(--gray-500);">Savings variance: KES ${Number((stats.reconciliation&&stats.reconciliation.savingsVariance)||0).toFixed(2)} · Repayment variance: KES ${Number((stats.reconciliation&&stats.reconciliation.repaymentVariance)||0).toFixed(2)} · Loan disbursement variance: KES ${Number((stats.reconciliation&&stats.reconciliation.loanDisbursementVariance)||0).toFixed(2)}</span>
                            </div>
                            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;">
                                    <div style="font-size:11px;color:var(--gray-500);">Pending approvals</div>
                                    <div style="font-size:22px;font-weight:800;color:var(--gray-800);">${totalPending}</div>
                                    <div style="font-size:10px;color:var(--gray-400);">Requires action</div>
                                </div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;">
                                    <div style="font-size:11px;color:var(--gray-500);">Active loans</div>
                                    <div style="font-size:22px;font-weight:800;color:var(--gray-800);">${Number(stats.activeLoans || activeLoans.length || 0)}</div>
                                    <div style="font-size:10px;color:var(--gray-400);">${Number(stats.defaultedLoans || 0)} defaulted</div>
                                </div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;">
                                    <div style="font-size:11px;color:var(--gray-500);">Today's savings</div>
                                    <div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.todaySavingsDeposits || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                    <div style="font-size:10px;color:var(--gray-400);">Completed deposits</div>
                                </div>
                                <div style="padding:14px;border:1px solid var(--gray-100);border-radius:12px;">
                                    <div style="font-size:11px;color:var(--gray-500);">Today's repayments</div>
                                    <div style="font-size:22px;font-weight:800;color:var(--gray-800);">KES ${Number(stats.todayLoanRepaymentsAmount || 0).toLocaleString('en-KE',{maximumFractionDigits:0})}</div>
                                    <div style="font-size:10px;color:var(--gray-400);">Completed repayments</div>
                                </div>
                            </div>
                        </div>

                        ${activeLoans.length > 0 ? `
                            <div class="section-card">
                                <div class="section-title"><i class="fas fa-hand-holding-usd" style="color:var(--warning);"></i> Active Loans (${activeLoans.length})</div>
                                ${activeLoans.slice(0, 5).map(loan => {
                                    const member = loan.members || {};
                                    const totalRepayment = loan.total_repayment || loan.amount * (1 + loan.interest_rate);
                                    const remaining = totalRepayment - loan.amount_paid;
                                    return `
                                        <div class="loan-item active">
                                            <div class="loan-info">
                                                <div class="amount">KES ${loan.amount.toFixed(2)}</div>
                                                <div class="details">
                                                    ${member.full_name || 'Unknown'} • Due: ${new Date(loan.repayment_due_date).toLocaleDateString()}
                                                    <br>Paid: KES ${loan.amount_paid.toFixed(2)} • Remaining: KES ${remaining.toFixed(2)}
                                                </div>
                                            </div>
                                            <span class="loan-status active">Active</span>
                                        </div>
                                    `;
                                }).join('')}
                                ${activeLoans.length > 5 ? `<p style="font-size:11px; color:var(--gray-400); margin-top:8px;">And ${activeLoans.length - 5} more active loans...</p>` : ''}
                            </div>
                        ` : ''}
                `;
            if (role === 'super_admin' || role === 'admin' || permissions.registration_approval) {
                const regCount = pendingRegistrations.length;
                html += `
                        <div class="pending-section">
                            <div class="section-header" onclick="toggleSection('registrations')">
                                <h3><i class="fas fa-user-plus" style="color:var(--primary);"></i> Pending Registration Fees <span class="count">${regCount}</span></h3>
                                <i class="fas fa-chevron-down toggle-icon open" id="registrations-toggle"></i>
                            </div>
                            <div id="registrations-content">
                    `;

                if (regCount === 0) {
                    html +=
                        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No pending registration fees</p></div>`;
                } else {
                    pendingRegistrations.forEach(m => {
                        html += `
                                <div class="pending-item">
                                    <div class="info">
                                        <div class="name">${m.full_name}</div>
                                        <div class="details">
                                            <i class="fas fa-id-card"></i> ${m.unique_member_id} &bull;
                                            <i class="fas fa-phone"></i> ${m.phone_number}
                                            <span class="type-badge registration">Registration</span>
                                            <span style="font-size:10px; color:var(--gray-400);">Fee: KES ${m.registration_fee_amount || 500}</span>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        <button class="approve" onclick="approveRegistration('${m.id}')"><i class="fas fa-check"></i> Approve</button>
                                        <button class="reject" onclick="rejectRegistration('${m.id}')"><i class="fas fa-times"></i> Reject</button>
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `</div></div>`;
            }
            if (role === 'super_admin' || role === 'admin' || role === 'treasurer' || permissions.savings_approval) {
                const transCount = pendingTransactions.length;
                html += `
                        <div class="pending-section">
                            <div class="section-header" onclick="toggleSection('transactions')">
                                <h3><i class="fas fa-money-bill-wave" style="color:var(--secondary);"></i> Pending Transactions <span class="count">${transCount}</span></h3>
                                <i class="fas fa-chevron-down toggle-icon open" id="transactions-toggle"></i>
                            </div>
                            <div id="transactions-content">
                    `;

                if (transCount === 0) {
                    html +=
                        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No pending transactions</p></div>`;
                } else {
                    pendingTransactions.forEach(t => {
                        const member = t.members || {};
                        const isRegistration = t.type === 'registration';
                        const typeLabel = isRegistration ? 'Registration Fee' : 'Savings Deposit';
                        const badgeClass = isRegistration ? 'registration' : 'savings';

                        html += `
                                <div class="pending-item">
                                    <div class="info">
                                        <div class="name">${member.full_name || 'Unknown Member'}</div>
                                        <div class="details">
                                            <i class="fas fa-money-bill-wave"></i> KES ${Number(t.amount).toFixed(2)} &bull;
                                            <i class="fas fa-mobile-alt"></i> ${t.mpesa_code || 'N/A'}
                                            <span class="type-badge ${badgeClass}">${typeLabel}</span>
                                            <span style="font-size:10px; color:var(--gray-400);">${new Date(t.created_at).toLocaleDateString()} ${new Date(t.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        <button class="approve" onclick="approveTransaction('${t.id}')"><i class="fas fa-check"></i> Approve</button>
                                        <button class="reject" onclick="rejectTransaction('${t.id}')"><i class="fas fa-times"></i> Reject</button>
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `</div></div>`;
            }
            if (role === 'super_admin' || role === 'admin' || permissions.loan_approval) {
                const loanCount = pendingLoans.length;
                html += `
                        <div class="pending-section">
                            <div class="section-header" onclick="toggleSection('loans')">
                                <h3><i class="fas fa-hand-holding-usd" style="color:var(--warning);"></i> Pending Loans <span class="count">${loanCount}</span></h3>
                                <i class="fas fa-chevron-down toggle-icon open" id="loans-toggle"></i>
                            </div>
                            <div id="loans-content">
                    `;

                if (loanCount === 0) {
                    html +=
                        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No pending loans</p></div>`;
                } else {
                    pendingLoans.forEach(l => {
                        const member = l.members || {};
                        html += `
                                <div class="pending-item">
                                    <div class="info">
                                        <div class="name">${member.full_name || 'Unknown'}</div>
                                        <div class="details">
                                            <i class="fas fa-money-bill-wave"></i> KES ${l.amount} &bull;
                                            ${l.repayment_period || 'N/A'}
                                            <span class="type-badge loan">Loan</span>
                                            <span style="font-size:10px; color:var(--gray-400);">Applied: ${new Date(l.application_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        ${(String(l.guarantor1_status||'pending')!=='pending' && String(l.guarantor2_status||'pending')!=='pending') ? (String(l.guarantor1_status||'pending')==='accepted' && String(l.guarantor2_status||'pending')==='accepted' ? '<button class="approve" onclick="approveLoan(\''+l.id+'\')"><i class="fas fa-check"></i> Final Approve & Disburse</button>' : '<span class="type-badge rejected"><i class="fas fa-circle-xmark"></i> Guarantor declined — final rejection</span>') : '<span class="type-badge pending"><i class="fas fa-hourglass-half"></i> Awaiting both guarantor responses</span>'}
                                        <div style="width:100%;font-size:11px;color:var(--gray-500);margin-top:6px;">Guarantor 1: <strong>${String(l.guarantor1_status||'pending').toUpperCase()}</strong> · Guarantor 2: <strong>${String(l.guarantor2_status||'pending').toUpperCase()}</strong></div>
                                        <button class="reject" onclick="rejectLoan('${l.id}')"><i class="fas fa-times"></i> Final Reject</button>
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `</div></div>`;
            }
            if (role === 'super_admin' || role === 'admin' || permissions.withdrawal_approval) {
                const wCount = pendingWithdrawals.length;
                html += `
                        <div class="pending-section">
                            <div class="section-header" onclick="toggleSection('withdrawals')">
                                <h3><i class="fas fa-arrow-up" style="color:var(--warning);"></i> Pending Withdrawals <span class="count">${wCount}</span></h3>
                                <i class="fas fa-chevron-down toggle-icon open" id="withdrawals-toggle"></i>
                            </div>
                            <div id="withdrawals-content">
                    `;

                if (wCount === 0) {
                    html +=
                        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No pending withdrawals</p></div>`;
                } else {
                    pendingWithdrawals.forEach(w => {
                        const member = w.members || {};
                        html += `
                                <div class="pending-item">
                                    <div class="info">
                                        <div class="name">${member.full_name || 'Unknown'}</div>
                                        <div class="details">
                                            <i class="fas fa-money-bill-wave"></i> KES ${w.amount} &bull;
                                            <i class="fas fa-phone"></i> ${w.phone || 'N/A'}
                                            <span class="type-badge withdrawal">Withdrawal</span>
                                            <span style="font-size:10px; color:var(--gray-400);">Requested: ${new Date(w.request_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        <button class="approve" onclick="approveWithdrawal('${w.id}')"><i class="fas fa-check"></i> Approve</button>
                                        <button class="reject" onclick="rejectWithdrawal('${w.id}')"><i class="fas fa-times"></i> Reject</button>
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `</div></div>`;
            }
            if (role === 'super_admin' || role === 'admin' || permissions.loan_approval || permissions.withdrawal_approval) {
                const payoutCount = processingPayouts.length;
                html += `
                    <div class="pending-section">
                        <div class="section-header" onclick="toggleSection('kcbPayouts')">
                            <h3><i class="fas fa-building-columns" style="color:var(--primary);"></i> KCB Payouts Awaiting Confirmation <span class="count">${payoutCount}</span></h3>
                            <i class="fas fa-chevron-down toggle-icon open" id="kcbPayouts-toggle"></i>
                        </div>
                        <div id="kcbPayouts-content">
                            ${payoutCount === 0 ? `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No KCB payouts awaiting confirmation</p></div>` : processingPayouts.map(p => {
                                const member = p.members || {};
                                const status = String(p.status || 'processing').toLowerCase();
                                const statusLabel = status === 'unknown' ? 'Needs reconciliation' : status === 'reconciliation_required' ? 'Manual reconciliation required' : status === 'initiating' ? 'Submitting to KCB' : 'Processing at KCB';
                                return `<div class="pending-item"><div class="info"><div class="name">${escapeHtml(member.full_name || 'Unknown Member')}</div><div class="details"><i class="fas fa-money-bill-wave"></i> KES ${Number(p.amount || 0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})} &bull; ${p.purpose === 'savings_withdrawal' ? 'Savings withdrawal' : 'Loan disbursement'}<br><span style="font-size:11px;color:var(--gray-500);">Reference: ${escapeHtml(p.transaction_reference || 'N/A')} · ${escapeHtml(p.status_message || statusLabel)}</span></div></div><div class="actions"><span class="type-badge pending">${escapeHtml(statusLabel)}</span></div></div>`;
                            }).join('')}
                        </div>
                    </div>`;
            }
            if (role === 'super_admin' || role === 'admin' || role === 'profile_approver' || permissions.profile_approval) {
                const editCount = pendingProfileEdits.length;
                html += `
                        <div class="pending-section">
                            <div class="section-header" onclick="toggleSection('profileEdits')">
                                <h3><i class="fas fa-user-edit" style="color:var(--warning);"></i> Pending Profile Edits <span class="count">${editCount}</span></h3>
                                <i class="fas fa-chevron-down toggle-icon open" id="profileEdits-toggle"></i>
                            </div>
                            <div id="profileEdits-content">
                    `;

                if (editCount === 0) {
                    html +=
                        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--secondary);"></i><p>No pending profile edits</p></div>`;
                } else {
                    pendingProfileEdits.forEach(e => {
                        const member = e.members || {};
                        const newData = JSON.parse(e.new_value || '{}');
                        const fields = Object.keys(newData).filter(k => newData[k] !== '').join(', ');
                        html += `
                                <div class="pending-item">
                                    <div class="info">
                                        <div class="name">${member.full_name || 'Unknown'}</div>
                                        <div class="details">
                                            <i class="fas fa-id-card"></i> ${member.unique_member_id || 'N/A'} &bull;
                                            <i class="fas fa-phone"></i> ${member.phone_number || 'N/A'}
                                            <span style="font-size:10px; color:var(--gray-500);">Fields: ${fields || 'All fields'}</span>
                                            <span class="type-badge profile">Profile Edit</span>
                                            <span style="font-size:10px; color:var(--gray-400);">Requested: ${new Date(e.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div class="actions">
                                        <button class="approve" onclick="approveProfileEdit('${e.id}', getCanonicalMemberId())"><i class="fas fa-check"></i> Approve</button>
                                        <button class="reject" onclick="rejectProfileEdit('${e.id}', getCanonicalMemberId())"><i class="fas fa-times"></i> Reject</button>
                                    </div>
                                </div>
                            `;
                    });
                }

                html += `</div></div>`;
            }

            html += `
                        <div style="margin-top:16px;">
                            <button class="btn-outline" onclick="navigateTo('dashboard')" style="padding:10px; font-size:13px;">
                                <i class="fas fa-arrow-left"></i> Back to Dashboard
                            </button>
                        </div>
                    </div>
                `;

            document.getElementById('dashboardContent').innerHTML = html;
        }
        async function checkLoanGrowthMethod() {
            try {
                const result = await callServer('checkActiveLoanGrowthMethod', {});
                if (result.success) {
                    showToast('Active Method: ' + result.activeMethod.toUpperCase(), 'info');
                    console.log('Settings:', result.settings);
                } else {
                    showToast('Error: ' + result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function revaluateAllMembers() {
            showConfirmDialog(
                'Re-evaluate All Members',
                'This will recalculate loan limits for all active members using the current method. Continue?',
                'warning',
                async function() {
                    try {
                        const result = await callServer('batchEvaluateLoanGrowth', {adminId:getCanonicalMemberId()});
                        if (result.success) {
                            showToast('Re-evaluated ' + result.totalEvaluated + ' members', 'success');
                            loadAdminDashboard();
                        } else {
                            showToast('Error: ' + result.message, 'error');
                        }
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Re-evaluate'
            );
        }
        function showSettings() {
            const isDark = document.body.classList.contains('dark-mode');
            const role = sessionStorage.getItem('memberRole') || 'member';
            const html = `<div class="dashboard-body">
                <div class="welcome-hero"><div><div class="welcome-kicker">Workspace Preferences</div><div class="welcome-title">Settings</div><div class="welcome-sub">Personal preferences, support and account security.</div></div></div>
                <div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Setting</th><th>Current State</th><th>Action</th></tr></thead><tbody>
                    <tr><td><strong>Appearance</strong><div class="text-muted" style="font-size:10px;margin-top:3px">Choose a comfortable display theme.</div></td><td>${isDark?'Dark mode':'Light mode'}</td><td><button class="btn-sm btn-outline" onclick="toggleDarkMode()"><i class="fas fa-moon"></i> ${isDark?'Use Light':'Use Dark'}</button></td></tr>
                    <tr><td><strong>Customer Care</strong><div class="text-muted" style="font-size:10px;margin-top:3px">Contact the support team for assistance.</div></td><td>Support available</td><td><button class="btn-sm btn-primary" onclick="navigateTo('messages')"><i class="fas fa-headset"></i> Contact Support</button></td></tr>
                    <tr><td><strong>Password</strong><div class="text-muted" style="font-size:10px;margin-top:3px">Keep your account secure with a strong password.</div></td><td>Protected</td><td><button class="btn-sm btn-outline" onclick="resetPasswordForm()"><i class="fas fa-key"></i> Change Password</button></td></tr>
                    ${role==='super_admin'||role==='admin'?`<tr><td><strong>Administration</strong><div class="text-muted" style="font-size:10px;margin-top:3px">Organization-wide controls and administrator assignment.</div></td><td>Restricted access</td><td><button class="btn-sm btn-primary" onclick="navigateTo('adminsettings')"><i class="fas fa-sliders-h"></i> Admin Settings</button></td></tr>`:''}
                </tbody></table></div>
                
            </div>`;
            document.getElementById('dashboardContent').innerHTML=html;
        }
        async function loadAdminSettingsPage() {
            const memberId=getCanonicalMemberId();
            const role=sessionStorage.getItem('memberRole');
            if(!memberId || !['super_admin','admin'].includes(role)){showToast('You do not have permission to open Admin Settings','error');navigateTo('dashboard');return;}
            try{
                const [settingsResult,growthResult,membersResult]=await Promise.all([
                    callServer('getSettings',{}),
                    callServer('getLoanGrowthSettings',{}),
                    role==='super_admin'?callServer('getAllMembers',{}):Promise.resolve({success:true,members:[]})
                ]);
                const settings=settingsResult.settings||settingsResult||{};
                const growth=growthResult.settings||{};
                const members=membersResult.members||[];
                let html=`<div class="dashboard-body"><div class="welcome-hero"><div><div class="welcome-kicker">Administration</div><div class="welcome-title">Admin Settings</div><div class="welcome-sub">Manage organization controls, lending policy and administrator access.</div></div><div class="admin-profile-chip"><i class="fas fa-user-shield"></i>${role==='super_admin'?'Super Admin':'Administrator'}</div></div>
                <div class="section-card"><div class="section-title"><i class="fas fa-sliders-h"></i> Organization Controls</div><form onsubmit="updateAdminSettingsPage(event)"><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Parameter</th><th>Current / New Value</th><th>Policy</th></tr></thead><tbody>
                    <tr><td>Registration Fee</td><td><input id="adminRegFee" type="number" min="0" step="50" value="${Number(settings.registration_fee||500)}"></td><td>One-time registration charge; not savings.</td></tr>
                    <tr><td>Default Withdrawal Fee</td><td><input id="adminWithdrawalFee" type="number" min="0" max="100" step="0.1" value="${Number(settings.default_withdrawal_fee||0.2)*100}"></td><td>Percentage charged on withdrawals.</td></tr>
                    <tr><td>Minimum Savings for Loan</td><td><input id="adminMinSavings" type="number" min="0" step="100" value="${Number(settings.min_savings_for_loan||0)}"></td><td>System threshold used during loan assessment.</td></tr>
                    <tr><td>Maximum Loan Multiplier</td><td><input id="adminMaxMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,Number(settings.max_loan_multiplier||3))}"></td><td>Absolute policy ceiling. Cannot exceed 3× eligible savings.</td></tr>
                    <tr><td>Default Repayment Days</td><td><input id="adminDefaultDays" type="number" min="1" value="${Number(settings.default_repayment_days||30)}"></td><td>Default only; member declares repayment period.</td></tr>
                    <tr><td>Late Payment Penalty</td><td><input id="adminLatePenalty" type="number" min="0" max="100" step="0.1" value="${Number(settings.late_payment_penalty||0)*100}"></td><td>Configured system penalty.</td></tr>
                </tbody></table></div><div style="margin-top:12px"><button class="btn-primary" type="submit"><i class="fas fa-save"></i> Save Organization Settings</button></div></form></div>
                <div class="section-card"><div class="section-title"><i class="fas fa-chart-line"></i> Loan Growth Policy</div><form onsubmit="updateLoanGrowthSettingsPage(event)"><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Tier / Rule</th><th>Threshold</th><th>Multiplier / Weight</th></tr></thead><tbody>
                    <tr><td>Platinum</td><td><input id="pagePlatinumThreshold" type="number" min="0" max="100" value="${growth.platinum_threshold||90}"></td><td><input id="pagePlatinumMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,growth.platinum_multiplier||3)}"></td></tr>
                    <tr><td>Gold</td><td><input id="pageGoldThreshold" type="number" min="0" max="100" value="${growth.gold_threshold||75}"></td><td><input id="pageGoldMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,growth.gold_multiplier||2.5)}"></td></tr>
                    <tr><td>Silver</td><td><input id="pageSilverThreshold" type="number" min="0" max="100" value="${growth.silver_threshold||60}"></td><td><input id="pageSilverMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,growth.silver_multiplier||2)}"></td></tr>
                    <tr><td>Bronze</td><td><input id="pageBronzeThreshold" type="number" min="0" max="100" value="${growth.bronze_threshold||45}"></td><td><input id="pageBronzeMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,growth.bronze_multiplier||1.5)}"></td></tr>
                    <tr><td>Basic</td><td>Below Bronze</td><td><input id="pageBasicMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,growth.basic_multiplier||1)}"></td></tr>
                    <tr><td><strong>Standard Multiplier</strong></td><td>Standard method</td><td><input id="pageBaseLoanMultiplier" type="number" min="0" max="3" step="0.1" value="${Math.min(3,Number(growth.base_loan_multiplier||3))}"></td></tr>
                    <tr><td><strong>Active Loan Method</strong></td><td>Only one method is active at a time</td><td><select id="pageActiveMethod"><option value="default" ${growth.active_method==='default'?'selected':''}>Standard</option><option value="advanced" ${growth.active_method==='advanced'?'selected':''}>Growth</option></select></td></tr>
                    <tr><td>Repayment Weight</td><td colspan="2"><input id="pageRepaymentWeight" type="number" min="0" max="100" value="${growth.repayment_weight||40}">%</td></tr>
                    <tr><td>Savings Weight</td><td colspan="2"><input id="pageSavingsWeight" type="number" min="0" max="100" value="${growth.savings_weight||30}">%</td></tr>
                    <tr><td>Borrowing Weight</td><td colspan="2"><input id="pageBorrowingWeight" type="number" min="0" max="100" value="${growth.borrowing_weight||20}">%</td></tr>
                    <tr><td>Reliability Weight</td><td colspan="2"><input id="pageReliabilityWeight" type="number" min="0" max="100" value="${growth.reliability_weight||10}">%</td></tr>
                </tbody></table></div><div style="margin-top:12px"><button class="btn-primary" type="submit"><i class="fas fa-save"></i> Save Loan Growth Policy</button></div></form></div>`;
                if(role==='super_admin'){
                    const adminMembers=members.filter(m=>m.role==='admin');
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-user-shield"></i> Administrator Assignment</div><div class="filter-toolbar"><input id="adminAssignSearch" placeholder="Search member name or code..." oninput="filterAdminAssignmentTable()"></div><div class="settings-table-wrap"><table class="settings-table" id="adminAssignmentTable"><thead><tr><th>Member</th><th>Member Code</th><th>Status</th><th>Current Role</th><th>Action</th></tr></thead><tbody>`;
                    members.forEach(m=>{if(m.role==='super_admin')return;html+=`<tr data-search="${String((m.full_name||'')+' '+(m.unique_member_id||'')+' '+(m.id_number||'')).toLowerCase()}"><td><strong>${m.full_name||''}</strong></td><td><span class="member-id-badge">${m.unique_member_id||''}</span></td><td>${m.is_active?'Active':'Inactive'}</td><td>${m.role||'member'}</td><td>${m.role==='admin'?`<button class="btn-sm btn-danger" onclick="removeAdminFromTable('${m.id}')"><i class="fas fa-user-minus"></i> Remove Admin</button>`:`<button class="btn-sm btn-primary" onclick="assignAdminFromTable('${m.id}')" ${m.is_active?'':'disabled'}><i class="fas fa-user-plus"></i> Assign Admin</button>`}</td></tr>`;});
                    html+=`</tbody></table></div><div style="margin-top:10px;font-size:11px;color:var(--gray-500)"><i class="fas fa-info-circle"></i> Only the Super Admin can assign or remove Administrator rights.</div></div>`;
                }
                html+=`<div style="margin-top:14px"><button class="btn-outline" onclick="navigateTo('settings')"><i class="fas fa-arrow-left"></i> Back to Settings</button></div></div>`;
                document.getElementById('dashboardContent').innerHTML=html;
            }catch(e){showToast('Error loading Admin Settings: '+e.message,'error');}
        }

        async function updateAdminSettingsPage(event){
            event.preventDefault();
            const adminId=getCanonicalMemberId();
            const settings={default_withdrawal_fee:Number(document.getElementById('adminWithdrawalFee').value||0)/100,min_savings_for_loan:Number(document.getElementById('adminMinSavings').value||0),max_loan_multiplier:Math.min(3,Number(document.getElementById('adminMaxMultiplier').value||3)),registration_fee:Number(document.getElementById('adminRegFee').value||500),default_repayment_days:Number(document.getElementById('adminDefaultDays').value||30),late_payment_penalty:Number(document.getElementById('adminLatePenalty').value||0)/100,loan_interest_rates:{"7":0.12,"14":0.16,"20":0.18,"21":0.20}};
            const r=await callServer('updateSettings',{settings,adminId}); if(r.success){showToast('Organization settings saved','success');loadAdminSettingsPage();}else showToast(r.message||'Could not save settings','error');
        }
        async function updateLoanGrowthSettingsPage(event){
            event.preventDefault();
            const settings={platinum_threshold:Number(document.getElementById('pagePlatinumThreshold').value),platinum_multiplier:Math.min(3,Number(document.getElementById('pagePlatinumMultiplier').value)),gold_threshold:Number(document.getElementById('pageGoldThreshold').value),gold_multiplier:Math.min(3,Number(document.getElementById('pageGoldMultiplier').value)),silver_threshold:Number(document.getElementById('pageSilverThreshold').value),silver_multiplier:Math.min(3,Number(document.getElementById('pageSilverMultiplier').value)),bronze_threshold:Number(document.getElementById('pageBronzeThreshold').value),bronze_multiplier:Math.min(3,Number(document.getElementById('pageBronzeMultiplier').value)),basic_multiplier:Math.min(3,Number(document.getElementById('pageBasicMultiplier').value)),base_loan_multiplier:Math.min(3,Number(document.getElementById('pageBaseLoanMultiplier').value)),active_method:document.getElementById('pageActiveMethod').value,repayment_weight:Number(document.getElementById('pageRepaymentWeight').value),savings_weight:Number(document.getElementById('pageSavingsWeight').value),borrowing_weight:Number(document.getElementById('pageBorrowingWeight').value),reliability_weight:Number(document.getElementById('pageReliabilityWeight').value)};
            const total=settings.repayment_weight+settings.savings_weight+settings.borrowing_weight+settings.reliability_weight; if(total!==100){showToast('Loan growth weights must total 100%','error');return;}
            const r=await callServer('updateLoanGrowthSettings',{settings,adminId:sessionStorage.getItem('memberIdNumber') || getCanonicalMemberId()}); if(r.success){showToast('Loan growth policy saved','success');loadAdminSettingsPage();}else showToast(r.message||'Could not save loan growth policy','error');
        }
        function filterAdminAssignmentTable(){const q=(document.getElementById('adminAssignSearch')?.value||'').toLowerCase();document.querySelectorAll('#adminAssignmentTable tbody tr').forEach(r=>r.style.display=(r.dataset.search||'').includes(q)?'':'none');}
        async function assignAdminFromTable(id){const r=await callServer('assignAdmin',{memberId:id,adminId:getCanonicalMemberId()});if(r.success){showToast(r.message,'success');loadAdminSettingsPage();}else showToast(r.message||'Could not assign administrator','error');}
        async function removeAdminFromTable(id){const r=await callServer('removeAdmin',{memberId:id,adminId:getCanonicalMemberId()});if(r.success){showToast(r.message,'success');loadAdminSettingsPage();}else showToast(r.message||'Could not remove administrator','error');}

        function showSystemSettings() {
            callServer('getSettings', {}).then(result => {
                if (!result.success) {
                    showToast('Could not load settings', 'error');
                    return;
                }

                const settings = result.settings;

                const html = `
                        <div id="systemSettingsModal" class="modal-overlay">
                            <div class="modal">
                                <div class="modal-header">
                                    <h2>⚙️ System Settings</h2>
                                    <button class="close-btn" onclick="closeModal('systemSettingsModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <form onsubmit="updateSystemSettings(event)">
                                    <div class="form-group">
                                        <label>Default Withdrawal Fee (%)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-percent"></i>
                                            <input type="number" id="withdrawalFee" step="0.5" min="0" max="50" value="${(settings.default_withdrawal_fee || 0.2) * 100}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Minimum Savings for Loan (KES)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-money-bill-wave"></i>
                                            <input type="number" id="minSavings" min="0" value="${settings.min_savings_for_loan || 0}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Max Loan Multiplier</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-times"></i>
                                            <input type="number" id="maxMultiplier" step="0.5" min="1" max="10" value="${settings.max_loan_multiplier || 3.0}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Registration Fee (KES)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-money-bill-wave"></i>
                                            <input type="number" id="regFee" min="0" value="${settings.registration_fee || 500}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Default Repayment Days</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-calendar-alt"></i>
                                            <input type="number" id="defaultDays" min="1" value="${settings.default_repayment_days || 30}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Late Payment Penalty (%)</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-percent"></i>
                                            <input type="number" id="latePenalty" step="0.5" min="0" max="100" value="${(settings.late_payment_penalty || 0.05) * 100}" required>
                                        </div>
                                    </div>
                                    <div class="info-box">
                                        <p><i class="fas fa-info-circle"></i> Loan interest rates: up to 7 days (12%), 8–14 days (16%), 15–20 days (18%), 21–30 days (20%)</p>
                                    </div>
                                    <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Save Settings</button>
                                    <button type="button" class="btn-outline" onclick="closeModal('systemSettingsModal')" style="margin-top:10px;">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            }).catch(error => {
                showToast('Error loading settings: ' + error.message, 'error');
            });
        }

        async function updateSystemSettings(event) {
            event.preventDefault();
            const adminId = sessionStorage.getItem('memberIdNumber') || getCanonicalMemberId();

            const settings = {
                default_withdrawal_fee: parseFloat(document.getElementById('withdrawalFee').value) / 100,
                min_savings_for_loan: parseFloat(document.getElementById('minSavings').value),
                max_loan_multiplier: parseFloat(document.getElementById('maxMultiplier').value),
                registration_fee: parseFloat(document.getElementById('regFee').value),
                default_repayment_days: parseInt(document.getElementById('defaultDays').value),
                late_payment_penalty: parseFloat(document.getElementById('latePenalty').value) / 100,
                loan_interest_rates: { "7": 0.12, "14": 0.16, "20": 0.18, "21": 0.20 }
            };

            try {
                const result = await callServer('updateSettings', { settings: settings, adminId: adminId });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('systemSettingsModal');
                    showSettings();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showLoanGrowthSettings() {
            callServer('getLoanGrowthSettings', {}).then(result => {
                if (!result.success) {
                    showToast('Could not load loan growth settings', 'error');
                    return;
                }

                const settings = result.settings;

                const html = `
                        <div id="loanGrowthSettingsModal" class="modal-overlay">
                            <div class="modal" style="max-width: 700px;">
                                <div class="modal-header">
                                    <h2>📈 Loan Growth Settings</h2>
                                    <button class="close-btn" onclick="closeModal('loanGrowthSettingsModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <form onsubmit="updateLoanGrowthSettings(event)">
                                    <div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">
                                        
                                        <h4 style="font-weight:600; color:var(--gray-700); margin:16px 0 12px 0; border-bottom:2px solid var(--gray-200); padding-bottom:8px;">🏆 Tier Thresholds (Score %) & Multipliers</h4>
                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Platinum Threshold (%)</label>
                                                <input type="number" id="platinumThreshold" step="1" min="0" max="100" value="${settings.platinum_threshold || 90}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Platinum Multiplier</label>
                                                <input type="number" id="platinumMultiplier" step="0.1" min="0" max="10" value="${settings.platinum_multiplier || 3.0}" required>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Gold Threshold (%)</label>
                                                <input type="number" id="goldThreshold" step="1" min="0" max="100" value="${settings.gold_threshold || 75}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Gold Multiplier</label>
                                                <input type="number" id="goldMultiplier" step="0.1" min="0" max="10" value="${settings.gold_multiplier || 2.5}" required>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Silver Threshold (%)</label>
                                                <input type="number" id="silverThreshold" step="1" min="0" max="100" value="${settings.silver_threshold || 60}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Silver Multiplier</label>
                                                <input type="number" id="silverMultiplier" step="0.1" min="0" max="10" value="${settings.silver_multiplier || 2.0}" required>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Bronze Threshold (%)</label>
                                                <input type="number" id="bronzeThreshold" step="1" min="0" max="100" value="${settings.bronze_threshold || 45}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Bronze Multiplier</label>
                                                <input type="number" id="bronzeMultiplier" step="0.1" min="0" max="10" value="${settings.bronze_multiplier || 1.5}" required>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Basic Multiplier</label>
                                            <input type="number" id="basicMultiplier" step="0.1" min="0" max="10" value="${settings.basic_multiplier || 1.0}" required>
                                        </div>

                                        <h4 style="font-weight:600; color:var(--gray-700); margin:16px 0 12px 0; border-bottom:2px solid var(--gray-200); padding-bottom:8px;">📊 Category Weights (Must sum to 100%)</h4>
                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Repayment History (%)</label>
                                                <input type="number" id="repaymentWeight" step="1" min="0" max="100" value="${settings.repayment_weight || 40}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Savings Record (%)</label>
                                                <input type="number" id="savingsWeight" step="1" min="0" max="100" value="${settings.savings_weight || 30}" required>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Previous Borrowing (%)</label>
                                                <input type="number" id="borrowingWeight" step="1" min="0" max="100" value="${settings.borrowing_weight || 20}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Reliability (%)</label>
                                                <input type="number" id="reliabilityWeight" step="1" min="0" max="100" value="${settings.reliability_weight || 10}" required>
                                            </div>
                                        </div>

                                        <h4 style="font-weight:600; color:var(--gray-700); margin:16px 0 12px 0; border-bottom:2px solid var(--gray-200); padding-bottom:8px;">🎁 Bonus Settings</h4>
                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>On-Time Bonus Threshold (# repayments)</label>
                                                <input type="number" id="onTimeBonusThreshold" step="1" min="0" value="${settings.on_time_bonus_threshold || 5}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>On-Time Bonus Amount (KES)</label>
                                                <input type="number" id="onTimeBonusAmount" step="100" min="0" value="${settings.on_time_bonus_amount || 10000}" required>
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Savings Bonus Threshold (# months)</label>
                                                <input type="number" id="savingsBonusThreshold" step="1" min="0" value="${settings.savings_bonus_threshold || 12}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Savings Bonus Amount (KES)</label>
                                                <input type="number" id="savingsBonusAmount" step="100" min="0" value="${settings.savings_bonus_amount || 15000}" required>
                                            </div>
                                        </div>

                                        <h4 style="font-weight:600; color:var(--gray-700); margin:16px 0 12px 0; border-bottom:2px solid var(--gray-200); padding-bottom:8px;">💰 Loan Limits</h4>
                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Min Loan Limit (KES)</label>
                                                <input type="number" id="minLoanLimit" step="100" min="0" value="${settings.min_loan_limit || 3000}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Max Loan Limit (KES)</label>
                                                <input type="number" id="maxLoanLimit" step="1000" min="0" value="${settings.max_loan_limit || 500000}" required>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Base Loan Multiplier</label>
                                            <input type="number" id="baseLoanMultiplier" step="0.1" min="0" max="10" value="${settings.base_loan_multiplier || 3.0}" required>
                                        </div>

                                        <div style="margin-top:16px; padding-top:16px; border-top:2px solid var(--gray-200);">
                                            <h4 style="font-weight:600; color:var(--gray-700); margin-bottom:12px;">⚙️ Active Loan Calculation Policy</h4>
                                            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-bottom:14px;">
                                                <div style="padding:14px 16px; border:1px solid var(--gray-200); border-radius:12px; background:var(--gray-50);">
                                                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--gray-500); font-weight:700;">Standard multiplier</div>
                                                    <div style="font-size:24px; font-weight:800; margin-top:4px;">${Number(settings.base_loan_multiplier ?? 3).toFixed(1)}×</div>
                                                    <div style="font-size:12px; color:var(--gray-500); margin-top:4px;">Eligible savings × multiplier</div>
                                                </div>
                                                <div style="padding:14px 16px; border:1px solid var(--gray-200); border-radius:12px; background:var(--gray-50);">
                                                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--gray-500); font-weight:700;">Growth multipliers</div>
                                                    <div style="font-size:14px; font-weight:700; margin-top:7px;">P ${Number(settings.platinum_multiplier ?? 3).toFixed(1)}× · G ${Number(settings.gold_multiplier ?? 2.5).toFixed(1)}×</div>
                                                    <div style="font-size:14px; font-weight:700; margin-top:3px;">S ${Number(settings.silver_multiplier ?? 2).toFixed(1)}× · B ${Number(settings.bronze_multiplier ?? 1.5).toFixed(1)}× · Basic ${Number(settings.basic_multiplier ?? 1).toFixed(1)}×</div>
                                                </div>
                                            </div>
                                            <div style="padding:14px 16px; border-radius:12px; background:var(--gray-50); border:1px solid var(--gray-200);">
                                                <div style="display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap;">
                                                    <div>
                                                        <div style="font-size:12px; color:var(--gray-500); font-weight:700; text-transform:uppercase; letter-spacing:.05em;">Calculation method</div>
                                                        <div style="font-size:13px; color:var(--gray-600); margin-top:3px;">Switching methods is immediate and does not alter savings or existing loan balances.</div>
                                                    </div>
                                                    <span style="padding:7px 12px; border-radius:999px; background:var(--primary); color:white; font-size:12px; font-weight:800;">${settings.active_method === 'advanced' ? 'GROWTH ACTIVE' : 'STANDARD ACTIVE'}</span>
                                                </div>
                                                <div class="form-group" style="margin-top:14px;">
                                                    <label>Active Loan Calculation Method</label>
                                                    <div class="input-wrapper">
                                                        <i class="fas fa-sliders-h"></i>
                                                        <select id="loanGrowthMethod" required>
                                                            <option value="default" ${settings.active_method !== 'advanced' ? 'selected' : ''}>Standard — use Standard Multiplier</option>
                                                            <option value="advanced" ${settings.active_method === 'advanced' ? 'selected' : ''}>Growth — use Member Tier Multiplier</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div style="font-size:12px; line-height:1.6; color:var(--gray-600);">
                                                    <strong>Standard:</strong> eligible savings × standard multiplier.<br>
                                                    <strong>Growth:</strong> eligible savings × member tier multiplier, with eligible bonuses where applicable.<br>
                                                    <strong>Control:</strong> the final limit can never exceed 3× eligible savings or the configured maximum loan limit.
                                                </div>
                                                <button type="button" class="btn-sm btn-success" onclick="activateLoanGrowthMethod()" style="margin-top:14px; background:#10B981; color:white; padding:9px 20px; border-radius:9px;">
                                                    <i class="fas fa-check-circle"></i> Apply Selected Method
                                                </button>
                                            </div>
                                        <div class="info-box" style="margin-top:12px;">
                                            <p><i class="fas fa-info-circle"></i> <strong>Current Weight Sum:</strong> <span id="weightSumDisplay">${(settings.repayment_weight || 40) + (settings.savings_weight || 30) + (settings.borrowing_weight || 20) + (settings.reliability_weight || 10)}%</span></p>
                                            <p style="font-size:12px; color:var(--gray-500);">All weights must sum to exactly 100% for accurate evaluation.</p>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn-primary" style="margin-top:16px;"><i class="fas fa-save"></i> Save Loan Growth Settings</button>
                                    <button type="button" class="btn-outline" onclick="closeModal('loanGrowthSettingsModal')" style="margin-top:10px;">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);

                document.querySelectorAll('#repaymentWeight, #savingsWeight, #borrowingWeight, #reliabilityWeight')
                    .forEach(input => {
                        input.addEventListener('input', updateWeightSum);
                    });

                updateWeightSum();

            }).catch(error => {
                showToast('Error loading settings: ' + error.message, 'error');
            });
        }

        function updateWeightSum() {
            const repayment = parseInt(document.getElementById('repaymentWeight').value) || 0;
            const savings = parseInt(document.getElementById('savingsWeight').value) || 0;
            const borrowing = parseInt(document.getElementById('borrowingWeight').value) || 0;
            const reliability = parseInt(document.getElementById('reliabilityWeight').value) || 0;
            const sum = repayment + savings + borrowing + reliability;
            const display = document.getElementById('weightSumDisplay');
            if (display) {
                display.textContent = sum + '%';
                display.style.color = sum === 100 ? 'var(--secondary)' : 'var(--danger)';
            }
        }

        async function activateLoanGrowthMethod() {
            const selector = document.getElementById('loanGrowthMethod');
            const method = selector ? selector.value : 'default';
            const adminId = getCanonicalMemberId();
            const button = selector && selector.closest('.form-group') ? selector.closest('.form-group').parentElement.querySelector('button') : null;
            if (button) { button.disabled = true; button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...'; }

            try {
                const result = await callServer('activateLoanGrowthMethod', { method: method, adminId: adminId });
                if (result.success) {
                    showToast(method === 'advanced' ? 'Growth loan calculation is now active.' : 'Standard loan calculation is now active.', 'success');
                    closeModal('loanGrowthSettingsModal');
                    showSettings();
                } else {
                    showToast(result.message || 'Could not change the loan calculation method.', 'error');
                }
            } catch (error) {
                showToast('Could not change the loan calculation method: ' + error.message, 'error');
            } finally {
                if (button) { button.disabled = false; button.innerHTML = '<i class="fas fa-check-circle"></i> Apply Selected Method'; }
            }
        }

        async function updateLoanGrowthSettings(event) {
            event.preventDefault();
            const adminId = getCanonicalMemberId();

            const settings = {
                platinum_threshold: parseFloat(document.getElementById('platinumThreshold').value),
                gold_threshold: parseFloat(document.getElementById('goldThreshold').value),
                silver_threshold: parseFloat(document.getElementById('silverThreshold').value),
                bronze_threshold: parseFloat(document.getElementById('bronzeThreshold').value),
                platinum_multiplier: parseFloat(document.getElementById('platinumMultiplier').value),
                gold_multiplier: parseFloat(document.getElementById('goldMultiplier').value),
                silver_multiplier: parseFloat(document.getElementById('silverMultiplier').value),
                bronze_multiplier: parseFloat(document.getElementById('bronzeMultiplier').value),
                basic_multiplier: parseFloat(document.getElementById('basicMultiplier').value),
                repayment_weight: parseFloat(document.getElementById('repaymentWeight').value),
                savings_weight: parseFloat(document.getElementById('savingsWeight').value),
                borrowing_weight: parseFloat(document.getElementById('borrowingWeight').value),
                reliability_weight: parseFloat(document.getElementById('reliabilityWeight').value),
                on_time_bonus_threshold: parseInt(document.getElementById('onTimeBonusThreshold').value),
                on_time_bonus_amount: parseFloat(document.getElementById('onTimeBonusAmount').value),
                savings_bonus_threshold: parseInt(document.getElementById('savingsBonusThreshold').value),
                savings_bonus_amount: parseFloat(document.getElementById('savingsBonusAmount').value),
                min_loan_limit: parseFloat(document.getElementById('minLoanLimit').value),
                max_loan_limit: parseFloat(document.getElementById('maxLoanLimit').value),
                base_loan_multiplier: parseFloat(document.getElementById('baseLoanMultiplier').value),
                active_method: document.getElementById('loanGrowthMethod').value
            };

            const weightSum = settings.repayment_weight + settings.savings_weight + settings.borrowing_weight + settings
                .reliability_weight;
            if (Math.round(weightSum) !== 100) {
                showToast('Category weights must sum to exactly 100%. Current sum: ' + weightSum + '%', 'error');
                return;
            }

            try {
                const result = await callServer('updateLoanGrowthSettings', { settings: settings, adminId: sessionStorage.getItem('memberIdNumber') || adminId });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('loanGrowthSettingsModal');
                    showSettings();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showAssignAdmin() {
            const html = `
                    <div id="assignAdminModal" class="modal-overlay">
                        <div class="modal">
                            <div class="modal-header">
                                <h2>👑 Assign Administrator</h2>
                                <button class="close-btn" onclick="closeModal('assignAdminModal')"><i class="fas fa-times"></i></button>
                            </div>
                            <form onsubmit="assignAdmin(event)">
                                <div class="form-group">
                                    <label>Member ID Number</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-id-card"></i>
                                        <input type="text" id="assignAdminId" placeholder="Enter member ID number" required>
                                    </div>
                                </div>
                                <div class="info-box">
                                    <p><i class="fas fa-info-circle"></i> The member will be granted full administrator rights.</p>
                                    <p style="font-size:12px; color:var(--gray-500); margin-top:4px;">Only Super Admin can perform this action.</p>
                                </div>
                                <button type="submit" class="btn-primary"><i class="fas fa-check"></i> Assign Admin</button>
                                <button type="button" class="btn-outline" onclick="closeModal('assignAdminModal')" style="margin-top:10px;">Cancel</button>
                            </form>
                        </div>
                    </div>
                `;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        async function assignAdmin(event) {
            event.preventDefault();
            const memberId = document.getElementById('assignAdminId').value;
            const adminId = getCanonicalMemberId();

            if (!memberId) { showToast('Please enter a member ID', 'error'); return; }

            try {
                const result = await callServer('assignAdmin', { memberId: memberId, adminId: adminId });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('assignAdminModal');
                    showSettings();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function showRemoveAdmin() {
            const html = `
                    <div id="removeAdminModal" class="modal-overlay">
                        <div class="modal">
                            <div class="modal-header">
                                <h2>🔒 Remove Administrator</h2>
                                <button class="close-btn" onclick="closeModal('removeAdminModal')"><i class="fas fa-times"></i></button>
                            </div>
                            <form onsubmit="removeAdmin(event)">
                                <div class="form-group">
                                    <label>Member ID Number</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-id-card"></i>
                                        <input type="text" id="removeAdminId" placeholder="Enter member ID number" required>
                                    </div>
                                </div>
                                <div class="info-box">
                                    <p><i class="fas fa-exclamation-triangle" style="color:var(--warning);"></i> This will remove administrator rights from the member.</p>
                                    <p style="font-size:12px; color:var(--gray-500); margin-top:4px;">Only Super Admin can perform this action.</p>
                                </div>
                                <button type="submit" class="btn-danger" style="width:100%; padding:14px; border:none; border-radius:var(--radius-xs); font-weight:700; cursor:pointer;"><i class="fas fa-trash"></i> Remove Admin</button>
                                <button type="button" class="btn-outline" onclick="closeModal('removeAdminModal')" style="margin-top:10px;">Cancel</button>
                            </form>
                        </div>
                    </div>
                `;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        async function removeAdmin(event) {
            event.preventDefault();
            const memberId = document.getElementById('removeAdminId').value;
            const adminId = getCanonicalMemberId();

            if (!memberId) { showToast('Please enter a member ID', 'error'); return; }

            try {
                const result = await callServer('removeAdmin', { memberId: memberId, adminId: adminId });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('removeAdminModal');
                    showSettings();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function loadRightsManagement() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            const role = sessionStorage.getItem('memberRole');
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            const isFullAdministrator = role === 'admin' || role === 'super_admin';
            if (!isFullAdministrator && !permissions.grant_rights) {
                showToast('You do not have permission to manage rights', 'error');
                navigateTo('dashboard');
                return;
            }

            try {
                const result = await callServer('getAllMembers', {});
                if (!result.success) {
                    showToast('Error loading members', 'error');
                    return;
                }

                const members = result.members || [];

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-user-lock" style="color:var(--primary);"></i> Rights Management</h2>
                                <span style="font-size:13px; color:var(--gray-500);">${members.length} members</span>
                            </div>

                            <div class="rights-table-container">
                                <div class="table-header">
                                    <h3><i class="fas fa-users"></i> Member Permissions</h3>
                                    <div class="search-box">
                                        <i class="fas fa-search" style="color:var(--gray-400);"></i>
                                        <input type="text" id="rightsSearch" placeholder="Search by name or ID..." onkeyup="filterRightsTable()">
                                    </div>
                                </div>
                                <div class="rights-table-wrapper">
                                    <table class="rights-table" id="rightsTable">
                                        <thead>
                                            <tr>
                                                <th>Member</th>
                                                <th>Role</th>
                                                <th>View Members</th>
                                                <th>Loan Approval</th>
                                                <th>Savings Approval</th>
                                                <th>Withdrawal Approval</th>
                                                <th>Registration Approval</th>
                                                <th>Grant Rights</th>
                                                <th>Customer Care</th>
                                                <th>Reports</th>
                                                <th>Profile Approval</th>
                                                <th>View Savings</th>
                                                <th>Edit Members</th>
                                                <th>View Repayments</th>
                                                <th>All Transactions</th>
                                                <th>Manage Settings</th>
                                                <th>Manage Content</th>
                                            </tr>
                                        </thead>
                                        <tbody id="rightsTableBody">
                    `;

                if (members.length === 0) {
                    html += `
                            <tr>
                                <td colspan="17" style="text-align:center; padding:30px; color:var(--gray-400);">
                                    <i class="fas fa-users" style="font-size:32px; display:block; margin-bottom:10px;"></i>
                                    No members found
                                </td>
                            </tr>
                        `;
                } else {
                    members.forEach((m) => {
                        const roleDisplay = m.role === 'super_admin' ? 'Super Admin' :
                            m.role === 'admin' ? 'Admin' :
                            m.role === 'treasurer' ? 'Treasurer' :
                            m.role === 'customer_care' ? 'Customer Care' :
                            m.role === 'profile_approver' ? 'Profile Approver' : 'Member';
                        const roleClass = m.role === 'super_admin' ? 'super_admin' :
                            m.role === 'admin' ? 'admin' :
                            m.role === 'treasurer' ? 'treasurer' :
                            m.role === 'customer_care' ? 'customer_care' :
                            m.role === 'profile_approver' ? 'profile_approver' : 'member';
                        const initials = m.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                        const perms = m.permissions || {};
                        const isRoleControlled = m.role === 'super_admin' || m.role === 'admin';
                        const disabled = isRoleControlled ? 'disabled' : '';
                        const fullAccessLabel = isRoleControlled ? '<div style="margin-top:3px;font-size:9px;color:var(--secondary);font-weight:800;"><i class="fas fa-check-circle"></i> FULL ADMIN ACCESS</div>' : '';

                        html += `
                                <tr>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                                            <div style="width:28px; height:28px; border-radius:50%; background:var(--primary-gradient); color:white; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; flex-shrink:0;">${initials}</div>
                                            <div>
                                                <div style="font-weight:500; color:var(--gray-800); font-size:12px;">${m.full_name}</div>
                                                <div style="font-size:10px; color:var(--gray-400);">${m.id_number} • ${m.unique_member_id}</div>${fullAccessLabel}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span class="role-badge ${roleClass}">${roleDisplay}</span></td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.view_members ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'view_members', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.loan_approval ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'loan_approval', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.savings_approval ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'savings_approval', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.withdrawal_approval ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'withdrawal_approval', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.registration_approval ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'registration_approval', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.grant_rights ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'grant_rights', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.customer_care ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'customer_care', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.view_reports ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'view_reports', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.profile_approval ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'profile_approval', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.view_savings ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'view_savings', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.edit_members ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'edit_members', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.view_repayments ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'view_repayments', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.view_transactions ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'view_transactions', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.manage_settings ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'manage_settings', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                    <td style="text-align:center;">
                                        <label class="switch">
                                            <input type="checkbox" ${perms.manage_content ? 'checked' : ''} ${disabled} onchange="togglePermission('${m.id}', 'manage_content', this.checked)">
                                            <span class="slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            `;
                    });
                }

                html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                            <div style="margin-top:16px;">
                                <button class="btn-outline" onclick="navigateTo('admin')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Admin Dashboard
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading rights management: ' + error.message, 'error');
            }
        }
        async function loadMembersPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;

            const role = sessionStorage.getItem('memberRole');
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            if (role !== 'super_admin' && role !== 'admin' && !permissions.view_members) {
                showToast('You do not have permission to view members', 'error');
                navigateTo('dashboard');
                return;
            }

            try {
                const result = await callServer('getAllMembers', {});
                if (!result.success) {
                    showToast('Error loading members', 'error');
                    return;
                }

                const members = result.members || [];

                let html = `
                        <div class="dashboard-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:8px;">
                                <h2 style="font-size:20px; font-weight:700; color:var(--gray-800);"><i class="fas fa-users" style="color:var(--primary);"></i> All Members (${members.length})</h2>
                                <div style="display:flex; gap:8px;">
                                    <input type="text" id="memberSearch" placeholder="Search members..." style="padding:8px 14px; border:1px solid var(--gray-200); border-radius:var(--radius-xs); font-size:13px; font-family:'Inter',sans-serif; width:200px;" onkeyup="filterMembers()">
                                </div>
                            </div>
                            <div class="table-card">
                                <div class="table-card-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;"><div><div class="table-card-title"><i class="fas fa-users"></i> Member Directory</div><div class="table-card-subtitle">Search, review and manage member accounts.</div></div><button type="button" class="btn-sm btn-primary" onclick="showAddExistingMemberModal()"><i class="fas fa-user-plus"></i> Add Existing Member</button></div>
                                <div class="pro-table-wrap">
                                    <table class="pro-table" id="membersTable">
                                        <thead>
                                            <tr>
                                                <th>Member</th>
                                                <th>Member Number</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="membersTableBody">
                    `;

                if (members.length === 0) {
                    html += `
                            <tr>
                                <td colspan="6" class="pro-table-empty">
                                    <i class="fas fa-users"></i>
                                    No members found
                                </td>
                            </tr>
                        `;
                } else {
                    members.forEach(m => {
                        const isAdminUser = m.role === 'super_admin' || m.role === 'admin';
                        const canViewAdmin = role === 'super_admin' || role === 'admin';

                        if (isAdminUser && !canViewAdmin) return;

                        const roleDisplay = m.role === 'super_admin' ? 'Super Admin' :
                            m.role === 'admin' ? 'Admin' :
                            m.role === 'treasurer' ? 'Treasurer' :
                            m.role === 'customer_care' ? 'Customer Care' :
                            m.role === 'profile_approver' ? 'Profile Approver' : 'Member';
                        const nameParts = m.full_name.split(' ');
                        let initials = '';
                        for (let i = 0; i < nameParts.length && i < 2; i++) {
                            initials += nameParts[i][0];
                        }
                        initials = initials.toUpperCase();
                        html += `
                                <tr data-name="${escapeHtml(String(m.full_name || '').toLowerCase())}" data-id="${escapeHtml(String(m.id_number || '').toLowerCase())}">
                                    <td>
                                        <div class="member-table-person">
                                            <span class="member-table-avatar">${initials}</span>
                                            <span><span class="name">${escapeHtml(m.full_name || 'Unnamed Member')}</span><span class="meta">${escapeHtml(m.phone_number || 'No phone')}</span></span>
                                        </div>
                                    </td>
                                    <td><span class="primary-text">${escapeHtml(m.unique_member_id || 'N/A')}</span><div class="secondary-text">${escapeHtml(m.id_number || '')}</div></td>
                                    <td><span class="role-badge ${escapeHtml(m.role || 'member')}">${escapeHtml(roleDisplay)}</span></td>
                                    <td>${m.is_active ? '<span class="table-status active"><i class="fas fa-circle-check"></i> Active</span>' : '<span class="table-status inactive"><i class="fas fa-clock"></i> Inactive</span>'}</td>
                                    <td><span class="secondary-text">${new Date(m.created_at).toLocaleDateString('en-KE',{day:'2-digit',month:'short',year:'numeric'})}</span></td>
                                    <td><div class="actions">
                                        <button class="btn-sm btn-info" onclick="viewMemberProfile('${m.id}')"><i class="fas fa-eye"></i> View</button>
                                        ${m.role !== 'super_admin' && m.role !== 'admin' ? (!m.is_active ? (m.registration_fee_paid && String(m.registration_fee_status || '').toLowerCase() === 'approved' ? `
                                            <button class="btn-sm btn-success" onclick="activateMember('${m.id}')"><i class="fas fa-user-check"></i> Activate</button>
                                        ` : `<span class="table-status inactive" title="Registration must be paid through KCB STK Push and approved first">Awaiting KCB fee approval</span>`) : `
                                            <button class="btn-sm btn-warning" onclick="deactivateMember('${m.id}')"><i class="fas fa-user-slash"></i> Deactivate</button>
                                        `) : ''}
                                        <button class="btn-sm btn-outline" onclick="adminEvaluateLoanGrowth('${m.id_number || m.unique_member_id || m.id}')"><i class="fas fa-chart-line"></i> Evaluate</button>
                                    </div></td>
                                </tr>
                            `;
                    });
                }

                html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style="margin-top:16px;">
                                <button class="btn-outline" onclick="navigateTo('admin')" style="padding:10px; font-size:13px;">
                                    <i class="fas fa-arrow-left"></i> Back to Admin
                                </button>
                            </div>
                        </div>
                    `;

                document.getElementById('dashboardContent').innerHTML = html;

            } catch (error) {
                showToast('Error loading members: ' + error.message, 'error');
            }
        }

        function showAddExistingMemberModal() {
            const html = `
                <div id="addExistingMemberModal" class="modal-overlay">
                    <div class="modal" style="max-width:720px;">
                        <div class="modal-header">
                            <h2><i class="fas fa-user-plus"></i> Add Existing SACCO Member</h2>
                            <button class="close-btn" onclick="closeModal('addExistingMemberModal')"><i class="fas fa-times"></i></button>
                        </div>
                        <form onsubmit="addExistingMember(event)">
                            <div class="info-box" style="margin-bottom:16px;">
                                <p><i class="fas fa-circle-info"></i> Use this option for members who were already part of the SACCO before the online portal was introduced. Enter the original joining date so historical records remain accurate. Their National ID will be set as the initial portal password.</p>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Full Name *</label><div class="input-wrapper"><i class="fas fa-user"></i><input id="existingMemberName" required autocomplete="name" placeholder="Full member name"></div></div>
                                <div class="form-group"><label>National ID Number *</label><div class="input-wrapper"><i class="fas fa-id-card"></i><input id="existingMemberIdNumber" required inputmode="numeric" placeholder="National ID number"></div></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Phone Number *</label><div class="input-wrapper"><i class="fas fa-phone"></i><input id="existingMemberPhone" required type="tel" placeholder="0712345678"></div></div>
                                <div class="form-group"><label>Email Address</label><div class="input-wrapper"><i class="fas fa-envelope"></i><input id="existingMemberEmail" type="email" placeholder="member@example.com"></div></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Original Joining Date *</label><div class="input-wrapper"><i class="fas fa-calendar-days"></i><input id="existingMemberJoiningDate" required type="date"></div></div>
                                <div class="form-group"><label>Opening Savings Balance</label><div class="input-wrapper"><i class="fas fa-coins"></i><input id="existingMemberOpeningSavings" type="number" min="0" step="0.01" value="0" placeholder="0.00"></div></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Occupation</label><div class="input-wrapper"><i class="fas fa-briefcase"></i><input id="existingMemberOccupation" placeholder="Occupation"></div></div>
                                <div class="form-group"><label>Address / Location</label><div class="input-wrapper"><i class="fas fa-location-dot"></i><input id="existingMemberAddress" placeholder="Location / address"></div></div>
                            </div>
                            <div class="form-row">
                                <div class="form-group"><label>Next of Kin</label><div class="input-wrapper"><i class="fas fa-user-group"></i><input id="existingMemberNextOfKin" placeholder="Full name"></div></div>
                                <div class="form-group"><label>Next of Kin Phone</label><div class="input-wrapper"><i class="fas fa-phone"></i><input id="existingMemberNextOfKinPhone" type="tel" placeholder="Phone number"></div></div>
                            </div>
                            <div class="form-group"><label>Relationship to Next of Kin</label><div class="input-wrapper"><i class="fas fa-link"></i><input id="existingMemberNextOfKinRelation" placeholder="e.g. Spouse, Parent, Sibling"></div></div>
                            <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px;">
                                <button type="button" class="btn-outline" onclick="closeModal('addExistingMemberModal')">Cancel</button>
                                <button type="submit" class="btn-primary" style="width:auto;min-width:190px;"><i class="fas fa-user-check"></i> Create Member Account</button>
                            </div>
                        </form>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        async function addExistingMember(event) {
            event.preventDefault();
            const data = {
                actorId: getCanonicalMemberId(),
                fullName: document.getElementById('existingMemberName').value.trim(),
                idNumber: document.getElementById('existingMemberIdNumber').value.trim(),
                phoneNumber: document.getElementById('existingMemberPhone').value.trim(),
                email: document.getElementById('existingMemberEmail').value.trim().toLowerCase(),
                joiningDate: document.getElementById('existingMemberJoiningDate').value,
                openingSavings: Number(document.getElementById('existingMemberOpeningSavings').value || 0),
                occupation: document.getElementById('existingMemberOccupation').value.trim(),
                address: document.getElementById('existingMemberAddress').value.trim(),
                nextOfKin: document.getElementById('existingMemberNextOfKin').value.trim(),
                nextOfKinPhone: document.getElementById('existingMemberNextOfKinPhone').value.trim(),
                nextOfKinRelation: document.getElementById('existingMemberNextOfKinRelation').value.trim()
            };
            if (!data.fullName || !data.idNumber || !data.phoneNumber || !data.joiningDate) {
                showToast('Full name, National ID, phone number and original joining date are required.', 'error');
                return;
            }
            if (!Number.isFinite(data.openingSavings) || data.openingSavings < 0) {
                showToast('Opening savings balance must be zero or a valid positive amount.', 'error');
                return;
            }
            try {
                const result = await callServer('adminAddExistingMember', data);
                if (result && result.success) {
                    closeModal('addExistingMemberModal');
                    showToast('Member added successfully. Member ID: ' + (result.memberId || 'CDO----') + '. Initial password is the National ID.', 'success');
                    await loadMembersPage();
                } else {
                    showToast((result && result.message) || 'Could not add member.', 'error');
                }
            } catch (error) {
                showToast('Error adding member: ' + error.message, 'error');
            }
        }

        function filterMembers() {
            const input = document.getElementById('memberSearch');
            if (!input) return;
            const filter = input.value.toLowerCase();
            const tbody = document.getElementById('membersTableBody');
            if (!tbody) return;
            const rows = tbody.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row) {
                    const name = row.dataset.name || '';
                    const id = row.dataset.id || '';
                    const text = name + ' ' + id;
                    row.style.display = text.includes(filter) ? '' : 'none';
                }
            }
        }
        async function refreshAdminAfterAction(reloadMember) {
            try { sessionStorage.removeItem('brightlife_admin_dashboard'); } catch (e) {}
            await loadAdminDashboard(true);
            if (reloadMember) await loadDashboard();
        }
        async function approveRegistration(id) {
            showConfirmDialog(
                'Approve Registration Fee',
                'Are you sure you want to approve this registration fee? This will activate the member\'s account.',
                'success',
                async function() {
                    try {
                        const result = await callServer('approveRegistrationFee', {memberId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(true);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Approve'
            );
        }

        async function rejectRegistration(id) {
            showConfirmDialog(
                'Reject Registration Fee',
                'Are you sure you want to reject this registration fee? The member will be notified.',
                'danger',
                async function() {
                    try {
                        const result = await callServer('rejectRegistrationFee', {memberId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Reject'
            );
        }

        async function approveTransaction(id) {
            showConfirmDialog(
                'Approve Transaction',
                'Are you sure you want to approve this transaction?',
                'success',
                async function() {
                    try {
                        const result = await callServer('approveSavings', {transactionId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(true);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Approve'
            );
        }

        async function rejectTransaction(id) {
            showConfirmDialog(
                'Reject Transaction',
                'Are you sure you want to reject this transaction?',
                'danger',
                async function() {
                    try {
                        const result = await callServer('rejectSavings', {transactionId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Reject'
            );
        }

        async function approveLoan(id) {
            showConfirmDialog(
                'Approve Loan',
                'Are you sure you want to approve this loan? The funds will be disbursed to the member.',
                'success',
                async function() {
                    try {
                        const result = await callServer('approveLoan', {loanId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Approve'
            );
        }

        async function rejectLoan(id) {
            showConfirmDialog(
                'Reject Loan',
                'Are you sure you want to reject this loan application?',
                'danger',
                async function() {
                    try {
                        const result = await callServer('rejectLoan', {loanId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Reject'
            );
        }

        async function approveWithdrawal(id) {
            showConfirmDialog(
                'Approve Withdrawal',
                'Are you sure you want to approve this withdrawal? The funds will be sent to the member.',
                'success',
                async function() {
                    try {
                        const result = await callServer('approveWithdrawal', {withdrawalId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Approve'
            );
        }

        async function rejectWithdrawal(id) {
            showConfirmDialog(
                'Reject Withdrawal',
                'Are you sure you want to reject this withdrawal request?',
                'danger',
                async function() {
                    try {
                        const result = await callServer('rejectWithdrawal', {withdrawalId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Reject'
            );
        }

        async function approveProfileEdit(approvalId, requesterId) {
            showConfirmDialog(
                'Approve Profile Edit',
                'Are you sure you want to approve this profile edit? The member\'s profile will be updated.',
                'success',
                async function() {
                    try {
                        const result = await callServer('approveProfileEdit', {approvalId: approvalId, requesterId: requesterId || getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(true);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Approve'
            );
        }

        async function rejectProfileEdit(approvalId, requesterId) {
            showConfirmDialog(
                'Reject Profile Edit',
                'Are you sure you want to reject this profile edit?',
                'danger',
                async function() {
                    try {
                        const result = await callServer('rejectProfileEdit', {approvalId: approvalId, requesterId: requesterId || getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        refreshAdminAfterAction(false);
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Reject'
            );
        }

        async function activateMember(id) {
            showConfirmDialog(
                'Activate Member',
                'Are you sure you want to activate this member?',
                'success',
                async function() {
                    try {
                        const result = await callServer('activateMember', {memberId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        loadMembersPage();
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Activate'
            );
        }

        async function deactivateMember(id) {
            showConfirmDialog(
                'Deactivate Member',
                'Are you sure you want to deactivate this member?',
                'danger',
                async function() {
                    try {
                        const result = await callServer('deactivateMember', {memberId:id, actorId:getCanonicalMemberId()});
                        showToast(result.message, result.success ? 'success' : 'error');
                        loadMembersPage();
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Deactivate'
            );
        }
        async function togglePermission(memberId, permission, value) {
            const role = sessionStorage.getItem('memberRole');

            if (role !== 'super_admin') {
                showToast('Only Super Admin can manage permissions', 'error');
                return;
            }

            try {
                const result = await callServer('togglePermission', { memberId, permission, value, actorId:getCanonicalMemberId() });
                if (result.success) {
                    showToast('Permission "' + permission + '" ' + (value ? 'granted' : 'removed'), 'success');
                    loadRightsManagement();
                } else {
                    showToast(result.message, 'error');
                    loadRightsManagement();
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
                loadRightsManagement();
            }
        }
        async function adminEvaluateLoanGrowth(memberId) {
            showConfirmDialog(
                'Evaluate Loan Growth',
                'Re-evaluate loan growth for this member? This will update their loan limit and tier.',
                'info',
                async function() {
                    try {
                        const result = await callServer('evaluateLoanGrowth', {memberId: memberId, actorId: getCanonicalMemberId(), sessionToken: sessionStorage.getItem('brightlifeSessionToken') || ''}, {force:true});
                        showToast(result.message, result.success ? 'success' : 'error');
                        if (result.success) await loadMembersPage();
                    } catch (error) {
                        showToast('Error: ' + error.message, 'error');
                    }
                },
                'Yes, Evaluate'
            );
        }
        async function viewMemberProfile(memberId) {
            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) {
                    showToast('Could not load member profile', 'error');
                    return;
                }

                const member = result.profile;
                const transactions = result.transactions || [];
                const loans = result.loans || [];

                const html = `
                        <div id="memberProfileModal" class="modal-overlay">
                            <div class="modal" style="max-width: 700px;">
                                <div class="modal-header">
                                    <h2>👤 ${member.full_name}</h2>
                                    <button class="close-btn" onclick="closeModal('memberProfileModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                    <div class="info-box">
                                        <p><strong>Member Number:</strong> ${member.unique_member_id}</p>
                                        <p><strong>ID Number:</strong> ${member.id_number}</p>
                                        <p><strong>Phone:</strong> ${member.phone_number}</p>
                                        <p><strong>Email:</strong> ${member.email || 'N/A'}</p>
                                        <p><strong>Role:</strong> ${member.role || 'Member'}</p>
                                    </div>
                                    <div class="info-box">
                                        <p><strong>Status:</strong> ${member.is_active ? '✅ Active' : '⏳ Inactive'}</p>
                                        <p><strong>Savings Balance:</strong> KES ${(member.savings_balance || 0).toFixed(2)}</p>
                                        <p><strong>Loan Limit:</strong> KES ${(member.loan_limit || 5000).toFixed(2)}</p>
                                        <p><strong>Loan Tier:</strong> ${(member.loan_growth_tier || 'basic').charAt(0).toUpperCase() + (member.loan_growth_tier || 'basic').slice(1)}</p>
                                        <p><strong>Joined:</strong> ${new Date(member.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                                    <button class="btn-sm btn-info" onclick="closeModal('memberProfileModal'); navigateTo('transactions')" style="background:#3B82F6; color:white;">View Transactions</button>
                                    <button class="btn-sm btn-warning" onclick="closeModal('memberProfileModal'); navigateTo('loans')" style="background:#F59E0B; color:white;">View Loans</button>
                                    <button class="btn-sm btn-success" onclick="closeModal('memberProfileModal'); showEditMemberProfile('${member.id}')" style="background:#10B981; color:white;">Edit Profile</button>
                                    <button class="btn-sm btn-secondary" onclick="closeModal('memberProfileModal')">Close</button>
                                    <button class="btn-sm btn-info" onclick="closeModal('memberProfileModal'); adminEvaluateLoanGrowth('${member.id_number || member.unique_member_id || member.id}')" style="background:#8B5CF6; color:white;">Evaluate Growth</button>
                                </div>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        async function showEditMemberProfile(memberId) {
            try {
                const result = await callServer('getMemberProfile', { memberId: memberId, actorId: getCanonicalMemberId() });
                if (!result.success) {
                    showToast('Could not load member profile', 'error');
                    return;
                }

                const member = result.profile;

                const html = `
                        <div id="editMemberModal" class="modal-overlay">
                            <div class="modal" style="max-width: 600px;">
                                <div class="modal-header">
                                    <h2>✏️ Edit Member - ${member.full_name}</h2>
                                    <button class="close-btn" onclick="closeModal('editMemberModal')"><i class="fas fa-times"></i></button>
                                </div>
                                <form onsubmit="updateMemberByAdmin(event, '${member.id}')">
                                    <div class="form-group">
                                        <label>Full Name</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-user"></i>
                                            <input type="text" id="editMemberName" value="${member.full_name}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-phone"></i>
                                            <input type="tel" id="editMemberPhone" value="${member.phone_number}" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Email</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-envelope"></i>
                                            <input type="email" id="editMemberEmail" value="${member.email || ''}">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Occupation</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-briefcase"></i>
                                            <input type="text" id="editMemberOccupation" value="${member.occupation || ''}" placeholder="Occupation">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Address</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-home"></i>
                                            <input type="text" id="editMemberAddress" value="${member.address || ''}" placeholder="Address">
                                        </div>
                                    </div>
                                    <div style="border-top:1px solid var(--gray-200); padding-top:16px; margin-top:8px;">
                                        <h4 style="font-size:14px; font-weight:600; color:var(--gray-700); margin-bottom:12px;">Next of Kin</h4>
                                    </div>
                                    <div class="form-group">
                                        <label>Next of Kin Name</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-user-friends"></i>
                                            <input type="text" id="editMemberNextOfKin" value="${member.next_of_kin || ''}" placeholder="Full name">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Next of Kin Phone</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-phone"></i>
                                            <input type="tel" id="editMemberNextOfKinPhone" value="${member.next_of_kin_phone || ''}" placeholder="0712345678">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Next of Kin Relationship</label>
                                        <div class="input-wrapper">
                                            <i class="fas fa-heart"></i>
                                            <input type="text" id="editMemberNextOfKinRelation" value="${member.next_of_kin_relation || ''}" placeholder="e.g., Spouse, Parent, Sibling">
                                        </div>
                                    </div>
                                    <div class="info-box">
                                        <p><strong>Member Number:</strong> ${member.unique_member_id}</p>
                                        <p><strong>ID Number:</strong> ${member.id_number}</p>
                                        <p><strong>Role:</strong> ${member.role || 'Member'}</p>
                                        <p><strong>Status:</strong> ${member.is_active ? '✅ Active' : '⏳ Inactive'}</p>
                                    </div>
                                    <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Member</button>
                                    <button type="button" class="btn-outline" onclick="closeModal('editMemberModal')" style="margin-top:10px;">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `;
                document.body.insertAdjacentHTML('beforeend', html);
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }

        async function updateMemberByAdmin(event, memberId) {
            event.preventDefault();

            const data = {
                fullName: document.getElementById('editMemberName').value,
                phoneNumber: document.getElementById('editMemberPhone').value,
                email: document.getElementById('editMemberEmail').value,
                occupation: document.getElementById('editMemberOccupation').value,
                address: document.getElementById('editMemberAddress').value,
                nextOfKin: document.getElementById('editMemberNextOfKin').value,
                nextOfKinPhone: document.getElementById('editMemberNextOfKinPhone').value,
                nextOfKinRelation: document.getElementById('editMemberNextOfKinRelation').value
            };

            try {
                const result = await callServer('updateMemberByAdmin', { memberId: memberId, data: data });
                if (result.success) {
                    showToast('Member updated successfully!', 'success');
                    closeModal('editMemberModal');
                    loadMembersPage();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function openReportSection(n){
            const targetId='reportSection'+Number(n);
            navigateTo('reports');
            const go=()=>{ const el=document.getElementById(targetId); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); };
            setTimeout(go,500);
            setTimeout(go,1200);
        }

        function isUuidLike_(value){
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value||'').trim());
        }
        function resolveReportMember_(row, members){
            row=row||{}; members=Array.isArray(members)?members:[];
            const candidates=[row.member_id,row.memberId,row.member_uuid,row.id];
            let m=null;
            for(const candidate of candidates){
                if(candidate==null||candidate==='') continue;
                m=members.find(x=>String(x.id||'')===String(candidate)||String(x.uuid||'')===String(candidate)||String(x.member_id||'')===String(candidate));
                if(m) break;
            }
            const number=(m&&(m.report_ref||m.unique_member_id||m.member_number))||row.member_number||row.member_ref||row.report_ref||'';
            const name=(m&&(m.member_name||m.full_name||m.name))||row.member_name||row.full_name||'';
            const fallback=(!isUuidLike_(row.member_id_display)&&row.member_id_display)||'';
            return {number:number||fallback||'—',name:name||'—',member:m||null};
        }
        function resolveReportActor_(actor){
            actor=actor||{};
            return actor.full_name||actor.name||actor.employee_name||actor.member_name||actor.report_ref||(!isUuidLike_(actor.id)?actor.id:'')||'System';
        }

        async function loadReportsPage() {
            const memberId=getCanonicalMemberId(); if(!memberId)return;
            const body=document.getElementById('dashboardContent');
            body.innerHTML='<div class="dashboard-body"><div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Loading reporting centre...</p></div></div>';
            try {
                const role=sessionStorage.getItem('memberRole')||'member';
                const permissions=JSON.parse(sessionStorage.getItem('permissions')||'{}');
                const isAdmin=['super_admin','admin','treasurer'].includes(role)||permissions.view_reports===true;
                if(!isAdmin){
                    const r=await callServer('getMemberProfile',{memberId},{force:true});
                    if(!r.success)throw new Error(r.message||'Could not load member report');
                    const p=r.profile||{}, loans=r.loans||[], tx=r.transactions||[], reps=r.repayments||[];
                    const totalSavings=tx.filter(t=>t.type==='savings'&&t.status==='completed').reduce((a,t)=>a+Number(t.amount||0),0);
                    const totalPaid=reps.reduce((a,t)=>a+Number(t.amount||0),0);
                    const outstanding=loans.filter(l=>l.status==='active').reduce((a,l)=>a+Math.max(0,Number(l.total_repayment||0)-Number(l.amount_paid||0)),0);
                    let html=`<div class="dashboard-body report-page"><div class="welcome-hero report-hero"><div><div class="welcome-kicker">Reporting Centre</div><div class="welcome-title">My Reports & Statements</div><div class="welcome-sub">Savings, contributions, loans, repayments and account activity.</div></div></div>`;
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-chart-pie"></i> Financial Snapshot</div><div class="metric-grid"><div class="metric-surface"><div class="metric-label">Savings Balance</div><div class="metric-value">KES ${Number(p.savings_balance||0).toLocaleString()}</div></div><div class="metric-surface"><div class="metric-label">Total Contributions</div><div class="metric-value">KES ${totalSavings.toLocaleString()}</div></div><div class="metric-surface"><div class="metric-label">Loan Repayments</div><div class="metric-value">KES ${totalPaid.toLocaleString()}</div></div><div class="metric-surface"><div class="metric-label">Outstanding Loan</div><div class="metric-value">KES ${outstanding.toLocaleString()}</div></div></div></div>`;
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-file-invoice-dollar"></i> Statement & Export Centre</div><div class="report-actions"><button class="btn-sm btn-primary" onclick="downloadReportPdf('summary','')"><i class="fas fa-file-pdf"></i> PDF Report</button><button class="btn-sm btn-outline" onclick="downloadReportPdf('statement','')"><i class="fas fa-file-alt"></i> Account Statement</button><button class="btn-sm btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print</button></div></div>`;
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-landmark"></i> Membership & Savings</div><div class="settings-table-wrap"><table class="settings-table"><tbody><tr><th>Member</th><td>${p.full_name||'—'}</td><th>National ID</th><td>${p.id_number||'—'}</td></tr><tr><th>Member Code</th><td>${p.unique_member_id||'—'}</td><th>Account Status</th><td>${p.is_active?'Active':'Pending'}</td></tr><tr><th>Savings Months</th><td>${p.qualifying_savings_months??0}</td><th>Loan Limit</th><td>KES ${Number(p.loan_limit||0).toLocaleString()}</td></tr></tbody></table></div></div>`;
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-hand-holding-usd"></i> Loan Portfolio</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Application</th><th>Amount</th><th>Interest</th><th>Total Due</th><th>Paid</th><th>Balance</th><th>Period</th><th>Due Date</th><th>Status</th></tr></thead><tbody>${loans.length?loans.map(l=>{const total=Number(l.total_repayment||l.amount||0),paid=Number(l.amount_paid||0),bal=Math.max(0,total-paid);return `<tr><td>${l.application_date?new Date(l.application_date).toLocaleDateString('en-KE'):'—'}</td><td>KES ${Number(l.amount||0).toLocaleString()}</td><td>${(Number(l.interest_rate||0)*100).toFixed(0)}%</td><td>KES ${total.toLocaleString()}</td><td>KES ${paid.toLocaleString()}</td><td>KES ${bal.toLocaleString()}</td><td>${l.repayment_period||'—'} days</td><td>${l.repayment_due_date?new Date(l.repayment_due_date).toLocaleDateString('en-KE'):'—'}</td><td>${l.status||'—'}</td></tr>`}).join(''):'<tr><td colspan="9">No loan records.</td></tr>'}</tbody></table></div></div>`;
                    html+=`<div class="section-card"><div class="section-title"><i class="fas fa-clock-rotate-left"></i> Repayment History</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Date</th><th>Amount</th><th>M-Pesa Code</th><th>Method</th></tr></thead><tbody>${reps.length?reps.map(x=>`<tr><td>${x.payment_date?new Date(x.payment_date).toLocaleString('en-KE'):'—'}</td><td>KES ${Number(x.amount||0).toLocaleString()}</td><td>${x.mpesa_code||'—'}</td><td>${x.payment_method||'M-Pesa'}</td></tr>`).join(''):'<tr><td colspan="4">No repayments recorded.</td></tr>'}</tbody></table></div></div>`;
                    html+=`</div>`; body.innerHTML=html; return;
                }
                const reportFrom=sessionStorage.getItem('reportFrom')||''; const reportTo=sessionStorage.getItem('reportTo')||'';
                const result=await callServer('getManagementReportData',{memberId,fromDate:reportFrom,toDate:reportTo},{force:true});
                if(!result.success)throw new Error(result.message||'Unable to load management reports');
                const s=result.summary||{}, members=result.members||[], loans=result.loans||[], reps=result.repayments||[], tx=result.transactions||[], withdrawals=result.withdrawals||[], g=result.guarantors||[], audit=result.audit||[], months=result.months||[], aging=result.aging||{};
                const money=v=>'KES '+Number(v||0).toLocaleString('en-KE',{minimumFractionDigits:0,maximumFractionDigits:0});
                const pct=v=>Number(v||0).toFixed(1)+'%';
                const date=v=>v?new Date(v).toLocaleDateString('en-KE'):'—';
                const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
                const kpi=(label,value,icon)=>`<div class="metric-surface"><div class="metric-label"><i class="fas ${icon}"></i> ${label}</div><div class="metric-value">${value}</div></div>`;
                let html=`<div class="dashboard-body report-page management-report-page"><div class="welcome-hero report-hero"><div><div class="welcome-kicker">Management Reporting Centre</div><div class="welcome-title">SND Brightlife CBO Reports</div><div class="welcome-sub">Management, financial, lending, reconciliation and risk reporting.</div></div><div class="member-code-card"><div class="code-label">Generated</div><div class="code">${date(result.generatedAt)}</div><div class="code-name">Management records</div></div></div>`;
                html+=`<div class="section-card" id="reportDirectory"><div class="section-title"><i class="fas fa-list-check"></i> Reports Available</div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px">${[
'1. Executive Summary','2. Membership Report','3. Registration Fees','4. Savings & Contributions','5. Loans & Disbursements','6. Loan Repayments & Collection','7. Loan Aging','8. Defaults / Risk','9. Guarantor Requests & History','10. Withdrawals','11. M-Pesa & Transaction Reconciliation','12. Member Loan Growth','13. Performance / 12-Month Activity','14. Audit Trail','15. Member Search & Filters','16. PDF Report','17. CSV Transaction Export','18. Print Report'].map((x,i)=>`<button class="btn-sm btn-outline" style="text-align:left" onclick="document.getElementById('reportSection${i+1}')?.scrollIntoView({behavior:'smooth',block:'start'})">${x}</button>`).join('')}</div></div>`;
html+=`<div class="section-card" id="reportFilters"><div class="section-title"><i class="fas fa-filter"></i> Report Filters</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label>From <input id="reportFrom" type="date" class="form-control" style="max-width:170px"></label><label>To <input id="reportTo" type="date" class="form-control" style="max-width:170px"></label><button class="btn-sm btn-primary" onclick="applyManagementReportFilters()"><i class="fas fa-filter"></i> Apply</button><button class="btn-sm btn-outline" onclick="clearManagementReportFilters()">Clear</button><button class="btn-sm btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print</button></div></div>`;
                html+=`<div class="section-card" id="reportSection1"><div class="section-title"><i class="fas fa-gauge-high"></i> 1. Executive Summary</div><div class="metric-grid">${kpi('Total Members',s.totalMembers,'fa-users')}${kpi('Active Members',s.activeMembers,'fa-user-check')}${kpi('Savings',money(s.savings),'fa-piggy-bank')}${kpi('Registration Fees',money(s.registrationFees),'fa-id-card')}${kpi('Active Loans',s.activeLoans,'fa-hand-holding-dollar')}${kpi('Outstanding Loan Balance',money(s.activeLoanBalance),'fa-scale-balanced')}${kpi('Repayments',money(s.repayments),'fa-money-bill-transfer')}${kpi('Withdrawals',money(s.withdrawals),'fa-arrow-up-from-bracket')}${kpi('Net Fund Movement',money(s.netFundMovement),'fa-chart-line')}${kpi('Overdue Loans',s.overdueLoans,'fa-triangle-exclamation')}${kpi('Defaults',s.defaultedLoans,'fa-circle-exclamation')}${kpi('Collection Rate',pct(s.collectionRate),'fa-percent')}</div></div>`;
                html+=`<div class="section-card" id="reportSection2"><div class="section-title"><i class="fas fa-users"></i> 2. Membership Report</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><input id="reportMemberSearch" oninput="filterLeadingMembers()" placeholder="Search member number or name" style="flex:1;min-width:220px"><select id="reportMemberStatus" onchange="filterLeadingMembers()"><option value="all">All statuses</option><option value="Active">Active</option><option value="Pending">Pending</option></select><input id="reportMinSavings" oninput="filterLeadingMembers()" type="number" min="0" placeholder="Min savings"></div><div class="settings-table-wrap"><table class="settings-table" id="leadingMembersTable"><thead><tr><th>Member Number</th><th>Member Name</th><th>Status</th><th>Savings</th><th>Saving Months</th><th>Loan Limit</th><th>Tier</th><th>Loans</th><th>Completed</th><th>Defaults</th></tr></thead><tbody>${members.map(m=>`<tr data-search="${esc(String(m.report_ref||'').toLowerCase())}" data-status="${m.status}" data-savings="${m.savings}"><td>${esc(m.report_ref||m.member_id_display||'—')}</td><td>${esc(m.member_name||m.full_name||'—')}</td><td>${esc(m.status)}</td><td>${money(m.savings)}</td><td>${m.accountAgeMonths||0}</td><td>${money(m.loanLimit)}</td><td>${esc(m.tier)}</td><td>${m.loans||0}</td><td>${m.completed||0}</td><td>${m.defaulted||0}</td></tr>`).join('')}</tbody></table></div></div>`;
                const fees=tx.filter(t=>t.type==='registration'&&t.status==='completed');
                html+=`<div class="section-card" id="reportSection3"><div class="section-title"><i class="fas fa-receipt"></i> 3. Registration Fees</div><div class="metric-grid">${kpi('Fees Collected',money(s.registrationFees),'fa-coins')}${kpi('Fee Transactions',fees.length,'fa-receipt')}</div></div>`;
                html+=`<div class="section-card" id="reportSection4"><div class="section-title"><i class="fas fa-money-check-dollar"></i> 4. Savings & Contributions</div><div class="metric-grid">${kpi('Total Savings Contributions',money(s.savings),'fa-piggy-bank')}${kpi('Members Saving',members.filter(m=>m.savings>0).length,'fa-user-plus')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Member Number</th><th>Member Name</th><th>Total Contributions</th><th>Current Savings</th><th>Months</th></tr></thead><tbody>${members.slice().sort((a,b)=>b.savings-a.savings).map(m=>`<tr><td>${esc(m.report_ref||'—')}</td><td>${esc(m.member_name||m.full_name||'—')}</td><td>${money(m.totalSavingsContributed)}</td><td>${money(m.savings)}</td><td>${m.accountAgeMonths||0}</td></tr>`).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection5"><div class="section-title"><i class="fas fa-hand-holding-dollar"></i> 5. Loans & Disbursements</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Member Number</th><th>Member Name</th><th>Amount</th><th>Interest</th><th>Total Repayment</th><th>Paid</th><th>Balance</th><th>Period</th><th>Application</th><th>Disbursement</th><th>Due</th><th>Status</th></tr></thead><tbody>${loans.map(l=>{const m=members.find(x=>String(x.id)===String(l.member_id))||{};return `<tr><td>${esc(resolveReportMember_(l,members).number)}</td><td>${esc(resolveReportMember_(l,members).name)}</td><td>${money(l.amount)}</td><td>${(Number(l.interest_rate||0)*100).toFixed(0)}%</td><td>${money(l.total_repayment)}</td><td>${money(l.amount_paid)}</td><td>${money(Math.max(0,Number(l.total_repayment||0)-Number(l.amount_paid||0)))}</td><td>${esc(l.repayment_period||'—')} days</td><td>${date(l.application_date)}</td><td>${date(l.approved_date)}</td><td>${date(l.repayment_due_date)}</td><td>${esc(l.status)}</td></tr>`}).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection7"><div class="section-title"><i class="fas fa-clock"></i> 7. Loan Aging</div><div class="metric-grid">${kpi('Not Due',money(aging.notDue),'fa-calendar-check')}${kpi('1–7 Days',money(aging.due7),'fa-calendar-day')}${kpi('8–30 Days',money(aging.due30),'fa-calendar-days')}${kpi('31–60 Days',money(aging.due60),'fa-calendar')}${kpi('61–90 Days',money(aging.due90),'fa-calendar-xmark')}${kpi('Over 90 Days',money(aging.over90),'fa-triangle-exclamation')}</div></div>`;
                html+=`<div class="section-card" id="reportSection8"><div class="section-title"><i class="fas fa-triangle-exclamation"></i> 8. Defaults / Risk</div><div class="metric-grid">${kpi('Overdue Loans',s.overdueLoans,'fa-clock')}${kpi('Defaulted Loans',s.defaultedLoans,'fa-circle-exclamation')}${kpi('Pending Loans',s.pendingLoans,'fa-hourglass-half')}${kpi('Pending Withdrawals',s.pendingWithdrawals,'fa-money-bill-transfer')}${kpi('Pending Transactions',s.pendingTransactions,'fa-receipt')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Risk Area</th><th>Count / Amount</th><th>Meaning</th></tr></thead><tbody><tr><td>Overdue balances</td><td>${money(aging.due7+aging.due30+aging.due60+aging.due90+aging.over90)}</td><td>Active loans past their declared due date with an outstanding balance.</td></tr><tr><td>Over 90 days</td><td>${money(aging.over90)}</td><td>Highest aging bucket requiring immediate follow-up.</td></tr><tr><td>Defaulted loans</td><td>${s.defaultedLoans}</td><td>Loans recorded with default status.</td></tr></tbody></table></div></div><div class="section-card" id="reportSection6"><div class="section-title"><i class="fas fa-money-bill-wave"></i> 6. Loan Repayments & Collection</div><div class="metric-grid">${kpi('Expected Repayment',money(s.expectedRepayment),'fa-bullseye')}${kpi('Paid',money(s.paidAgainstLoans),'fa-circle-check')}${kpi('Outstanding',money(Math.max(0,s.expectedRepayment-s.paidAgainstLoans)),'fa-scale-balanced')}${kpi('Collection Rate',pct(s.collectionRate),'fa-percent')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Date</th><th>Member Number</th><th>Member Name</th><th>Amount</th><th>M-Pesa</th><th>Method</th></tr></thead><tbody>${reps.map(r=>{const m=members.find(x=>String(x.id)===String(r.member_id))||{};return `<tr><td>${date(r.payment_date)}</td><td>${esc(resolveReportMember_(r,members).number)}</td><td>${esc(resolveReportMember_(r,members).name)}</td><td>${money(r.amount)}</td><td>${esc(r.mpesa_code||'—')}</td><td>${esc(r.payment_method||'M-Pesa')}</td></tr>`}).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection9"><div class="section-title"><i class="fas fa-user-shield"></i> 9. Guarantor Requests & History</div><div class="metric-grid">${kpi('Pending Guarantees',s.guaranteePending,'fa-hourglass-half')}${kpi('Accepted',s.guaranteeAccepted,'fa-check')}${kpi('Declined',s.guaranteeDeclined,'fa-xmark')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Member Number</th><th>Member Name</th><th>Loan</th><th>Interest</th><th>Total</th><th>Paid</th><th>Balance</th><th>G1</th><th>G1 Status</th><th>G2</th><th>G2 Status</th><th>Loan Status</th></tr></thead><tbody>${g.map(x=>`<tr><td>${esc(x.borrower.report_ref||'—')}</td><td>${esc(x.borrower.full_name||'—')}</td><td>${money(x.amount)}</td><td>${(x.interestRate*100).toFixed(0)}%</td><td>${money(x.totalRepayment)}</td><td>${money(x.amountPaid)}</td><td>${money(x.balance)}</td><td>${esc(x.g1||'—')}</td><td>${esc(x.g1Status)}</td><td>${esc(x.g2||'—')}</td><td>${esc(x.g2Status)}</td><td>${esc(x.status)}</td></tr>`).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection10"><div class="section-title"><i class="fas fa-arrow-up-from-bracket"></i> 10. Withdrawals</div><div class="metric-grid">${kpi('Completed Withdrawals',money(s.withdrawals),'fa-money-bill-transfer')}${kpi('Pending Withdrawals',s.pendingWithdrawals,'fa-hourglass-half')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Date</th><th>Member Number</th><th>Member Name</th><th>Amount</th><th>Status</th><th>M-Pesa</th></tr></thead><tbody>${withdrawals.map(w=>{const m=members.find(x=>String(x.id)===String(w.member_id))||{};return `<tr><td>${date(w.created_at)}</td><td>${esc(resolveReportMember_(w,members).number)}</td><td>${esc(resolveReportMember_(w,members).name)}</td><td>${money(w.amount)}</td><td>${esc(w.status)}</td><td>${esc(w.mpesa_code||'—')}</td></tr>`}).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection11"><div class="section-title"><i class="fas fa-arrows-rotate"></i> 11. M-Pesa & Transaction Reconciliation</div><div class="metric-grid">${kpi('Money In',money(s.registrationFees+s.savings+s.repayments),'fa-arrow-down')}${kpi('Money Out',money(s.disbursements+s.withdrawals),'fa-arrow-up')}${kpi('Net Movement',money(s.netFundMovement),'fa-scale-balanced')}${kpi('Pending Transactions',s.pendingTransactions,'fa-clock')}</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Date</th><th>Member Number</th><th>Member Name</th><th>Type</th><th>Amount</th><th>Method</th><th>M-Pesa Code</th><th>Status</th></tr></thead><tbody>${tx.map(t=>{const m=members.find(x=>String(x.id)===String(t.member_id))||{};return `<tr><td>${date(t.created_at)}</td><td>${esc(resolveReportMember_(t,members).number)}</td><td>${esc(resolveReportMember_(t,members).name)}</td><td>${esc(t.type)}</td><td>${money(t.amount)}</td><td>${esc(t.payment_method||'—')}</td><td>${esc(t.mpesa_code||'—')}</td><td>${esc(t.status)}</td></tr>`}).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection12"><div class="section-title"><i class="fas fa-chart-line"></i> 12. Member Loan Growth</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Member Number</th><th>Member Name</th><th>Savings</th><th>Loan Limit</th><th>Tier</th><th>Loans</th><th>Completed</th><th>On-time</th><th>Late</th><th>Defaults</th></tr></thead><tbody>${members.map(m=>`<tr><td>${esc(m.report_ref||'—')}</td><td>${esc(m.member_name||m.full_name||'—')}</td><td>${money(m.savings)}</td><td>${money(m.loanLimit)}</td><td>${esc(m.tier)}</td><td>${m.loans}</td><td>${m.completed}</td><td>${m.onTime}</td><td>${m.late}</td><td>${m.defaulted}</td></tr>`).join('')}</tbody></table></div></div>`;
                const maxMonth=Math.max(1,...months.map(m=>Math.max(m.savings,m.repayments,m.disbursements,m.withdrawals,m.registrations)));
                html+=`<div class="section-card" id="reportSection13"><div class="section-title"><i class="fas fa-chart-column"></i> 13. Performance / 12-Month Activity</div><div style="overflow-x:auto"><div style="display:flex;align-items:flex-end;gap:10px;min-width:720px;height:230px;padding:12px">${months.map(m=>`<div style="flex:1;text-align:center"><div style="font-size:9px">${money(m.savings)}</div><div style="height:${Math.max(4,(m.savings/maxMonth)*150)}px;background:var(--primary,#6c3ce1);border-radius:4px 4px 0 0"></div><div style="font-size:10px;margin-top:5px">${esc(m.label)}</div></div>`).join('')}</div></div><div style="font-size:11px;color:var(--gray-500)">Monthly savings contributions. The transaction and reconciliation tables above provide repayments, disbursements, withdrawals and registration fees for the same period.</div></div>`;
                html+=`<div class="section-card" id="reportSection14"><div class="section-title"><i class="fas fa-shield-halved"></i> 14. Audit Trail</div><div class="settings-table-wrap"><table class="settings-table"><thead><tr><th>Date</th><th>Action</th><th>Member Number</th><th>Member Name</th><th>Processed By</th><th>Amount</th><th>M-Pesa</th><th>Status</th><th>Description</th></tr></thead><tbody>${audit.map(a=>`<tr><td>${date(a.date)}</td><td>${esc(a.action)}</td><td>${esc(a.member.report_ref||'—')}</td><td>${esc(a.member.full_name||'—')}</td><td>${esc(resolveReportActor_(a.actor))}</td><td>${money(a.amount)}</td><td>${esc(a.mpesa||'—')}</td><td>${esc(a.status)}</td><td>${esc(a.description)}</td></tr>`).join('')}</tbody></table></div></div>`;
                html+=`<div class="section-card" id="reportSection15"><div class="section-title"><i class="fas fa-magnifying-glass"></i> 15. Member Search & Filters</div><p style="font-size:12px;color:var(--gray-500)">Use the Membership Report search above to filter by member reference, status and minimum savings. Results update instantly.</p><button class="btn-sm btn-primary" onclick="document.getElementById('reportMemberSearch')?.focus();document.getElementById('reportSection2')?.scrollIntoView({behavior:'smooth'})"><i class="fas fa-search"></i> Open Member Search</button></div>
<div class="section-card" id="reportSection16"><div class="section-title"><i class="fas fa-file-pdf"></i> 16. PDF Report</div><p style="font-size:12px;color:var(--gray-500)">Generate a professionally formatted organization report from the current reporting records.</p><button class="btn-sm btn-primary" onclick="downloadReportPdf('summary','')"><i class="fas fa-file-pdf"></i> Generate PDF Report</button></div>
<div class="section-card" id="reportSection17"><div class="section-title"><i class="fas fa-file-csv"></i> 17. CSV Transaction Export</div><p style="font-size:12px;color:var(--gray-500)">Export the transaction ledger, including M-Pesa references, for reconciliation.</p><button class="btn-sm btn-primary" onclick="exportAdminTransactions()"><i class="fas fa-file-csv"></i> Export Transactions CSV</button></div>
<div class="section-card" id="reportSection18"><div class="section-title"><i class="fas fa-print"></i> 18. Print Report</div><p style="font-size:12px;color:var(--gray-500)">Print the complete reporting centre.</p><button class="btn-sm btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Print Full Report</button></div>
<div class="section-card"><div class="section-title"><i class="fas fa-download"></i> Export Centre</div><div class="report-actions"><button class="btn-sm btn-primary" onclick="downloadReportPdf('summary','')"><i class="fas fa-file-pdf"></i> Organization PDF</button><button class="btn-sm btn-outline" onclick="exportAdminTransactions()"><i class="fas fa-file-csv"></i> CSV Transactions</button><button class="btn-sm btn-outline" onclick="window.print()"><i class="fas fa-print"></i> Print Full Report</button></div><div class="text-muted" style="font-size:11px;margin-top:8px">Registration fees are shown separately from savings. M-Pesa references are displayed from recorded transaction data.</div></div></div>`;
                body.innerHTML=html;
                const rf=document.getElementById('reportFrom'),rt=document.getElementById('reportTo'); if(rf)rf.value=sessionStorage.getItem('reportFrom')||''; if(rt)rt.value=sessionStorage.getItem('reportTo')||'';
                window._managementReport={result};
            } catch(error) {
                body.innerHTML='<div class="dashboard-body"><div class="status-banner warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Unable to load reports</strong><br><span style="font-size:13px">'+String(error.message||error)+'</span></div></div><div style="text-align:center;padding:24px"><button class="btn-primary" onclick="loadReportsPage()"><i class="fas fa-sync-alt"></i> Retry Reports</button></div></div>';
            }
        }
        function applyManagementReportFilters(){
            const from=document.getElementById('reportFrom')?.value||'',to=document.getElementById('reportTo')?.value||'';
            if(from&&to&&new Date(from)>new Date(to)){showToast('From date cannot be after To date.','error');return;}
            sessionStorage.setItem('reportFrom',from); sessionStorage.setItem('reportTo',to); loadReportsPage();
        }
        function clearManagementReportFilters(){sessionStorage.removeItem('reportFrom');sessionStorage.removeItem('reportTo');loadReportsPage();}
        function filterLeadingMembers(){const q=(document.getElementById('reportMemberSearch')?.value||'').toLowerCase(),status=document.getElementById('reportMemberStatus')?.value||'all',min=Number(document.getElementById('reportMinSavings')?.value||0);document.querySelectorAll('#leadingMembersTable tbody tr').forEach(r=>{r.style.display=((r.dataset.search||'').includes(q)&&(status==='all'||r.dataset.status===status)&&Number(r.dataset.savings||0)>=min)?'':'none';});}

        async function downloadReportPdf(type, targetMemberId) {
            const memberId = getCanonicalMemberId(); if(!memberId)return;
            try {
                showToast('Preparing professional PDF report…','info');
                const result=await callServer('generateReportPdf',{memberId:memberId,targetMemberId:targetMemberId||null,reportType:type});
                if(!result.success) throw new Error(result.message||'Report generation failed');
                const bytes=Uint8Array.from(atob(result.base64),c=>c.charCodeAt(0));
                const blob=new Blob([bytes],{type:'application/pdf'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=result.filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); showToast('PDF report generated.','success');
            } catch(e){showToast('Could not generate report: '+e.message,'error');}
        }

        async function loadExecutivePage() {
            const memberId=getCanonicalMemberId(); if(!memberId)return;
            const result=await callServer('getExecutiveDashboard',{memberId});
            if(!result.success){showToast(result.message||'Unable to load Executive','error');return;}
            const isOrg=result.scope==='organization', stats=result.stats||{}, trend=result.trend||[];
            const max=Math.max(1,...trend.map(x=>Math.max(x.savings||0,x.repayments||0,x.loans||0)));
            let html=`<div class="dashboard-body"><div class="welcome-hero"><div><div class="welcome-kicker">Executive Overview</div><div class="welcome-title">${isOrg?'Performance at a glance':'Your progress at a glance'}</div><div class="welcome-sub">${isOrg?'Monitor members, savings, lending, repayment and risk.':'Track your savings, loans and repayment progress.'}</div></div></div>`;
            html+=`<div class="section-card"><div class="section-title"><i class="fas fa-gauge-high"></i> Key Performance Indicators</div><div class="exec-grid">`;
            if(isOrg){[['Members',stats.totalMembers],['Active',stats.activeMembers],['Savings + Registration Fees','KES '+(stats.totalSavingsIncludingRegistration||0).toLocaleString()],['Registration Fees','KES '+(stats.registrationFees||0).toLocaleString()],['Active Loans',stats.activeLoans],['Loan Balance','KES '+(stats.activeLoanBalance||0).toLocaleString()],['Overdue',stats.overdueLoans],['Pending Loans',stats.pendingLoans],['Defaults',stats.defaultedLoans]].forEach(x=>html+=`<div class="exec-stat"><div class="l">${x[0]}</div><div class="v">${x[1]||0}</div></div>`);} else {const p=result.profile||{}; [['Savings','KES '+(p.savings_balance||0).toLocaleString()],['Loan Limit','KES '+(p.loan_limit||0).toLocaleString()],['Loans Taken',p.total_loans_taken],['Completed',p.total_loans_completed],['On-time',p.on_time_repayments],['Late',p.late_repayments],['Savings Months',p.qualifying_savings_months],['Tier',p.loan_growth_tier||'Basic']].forEach(x=>html+=`<div class="exec-stat"><div class="l">${x[0]}</div><div class="v">${x[1]||0}</div></div>`);} html+=`</div></div>`;
            html+=`<div class="section-card"><div class="section-title"><i class="fas fa-chart-column"></i> Monthly Trend</div><div class="trend-wrap">${trend.map(x=>`<div class="trend-col"><div class="trend-value">${Math.round(x.savings||0).toLocaleString()}</div><div class="trend-bar" style="height:${Math.max(3,(x.savings||0)/max*150)}px"></div><div class="trend-label">${x.label}</div></div>`).join('')}</div></div></div>`;
            document.getElementById('dashboardContent').innerHTML=html;
        }
        function toggleSection(section) {
            const content = document.getElementById(section + '-content');
            const toggle = document.getElementById(section + '-toggle');
            if (content) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    if (toggle) toggle.classList.add('open');
                } else {
                    content.style.display = 'none';
                    if (toggle) toggle.classList.remove('open');
                }
            }
        }

        function filterRightsTable() {
            const input = document.getElementById('rightsSearch');
            if (!input) return;
            const filter = input.value.toLowerCase();
            const tbody = document.getElementById('rightsTableBody');
            if (!tbody) return;
            const rows = tbody.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row) {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(filter) ? '' : 'none';
                }
            }
        }
        function showCustomerCareSettings() {
            const html = `
                    <div id="customerCareSettingsModal" class="modal-overlay">
                        <div class="modal">
                            <div class="modal-header">
                                <h2>📞 Customer Care Settings</h2>
                                <button class="close-btn" onclick="closeModal('customerCareSettingsModal')"><i class="fas fa-times"></i></button>
                            </div>
                            <form onsubmit="updateCustomerCareNumber(event)">
                                <div class="form-group">
                                    <label>Customer Care Phone Number</label>
                                    <div class="input-wrapper">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="customerCareNumber" placeholder="+254700000000" required>
                                    </div>
                                </div>
                                <div class="info-box">
                                    <p>This number will receive all customer care messages from members.</p>
                                </div>
                                <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Number</button>
                                <button type="button" class="btn-outline" onclick="closeModal('customerCareSettingsModal')" style="margin-top:10px;">Cancel</button>
                            </form>
                        </div>
                    </div>
                `;
            document.body.insertAdjacentHTML('beforeend', html);
        }

        async function updateCustomerCareNumber(event) {
            event.preventDefault();
            const phone = document.getElementById('customerCareNumber').value;

            if (!phone || phone.length < 10) { showToast('Please enter a valid phone number', 'error'); return; }

            try {
                const result = await callServer('updateCustomerCareNumber', { phone });
                if (result.success) {
                    showToast(result.message, 'success');
                    closeModal('customerCareSettingsModal');
                    loadAdminDashboard();
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Error: ' + error.message, 'error');
            }
        }
        function resetPasswordForm() {
            const memberId = getCanonicalMemberId();
            const newPassword = prompt('Enter new password (min 6 characters):');
            if (!newPassword || newPassword.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            const confirm = prompt('Confirm new password:');
            if (newPassword !== confirm) {
                showToast('Passwords do not match', 'error');
                return;
            }

            callServer('resetPassword', { memberId, newPassword })
                .then(result => showToast(result.message, result.success ? 'success' : 'error'))
                .catch(error => showToast('Error: ' + error.message, 'error'));
        }
        async function refreshAdminDashboard() {
            showToast('Refreshing admin dashboard...', 'info');
            await loadAdminDashboard();
            showToast('Admin dashboard refreshed!', 'success');
        }
        function formatGuarantorMoney(v){ return Number(v||0).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}); }
        async function loadGuarantorRequestsPage() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;
            const body = document.getElementById('dashboardContent');
            body.innerHTML = '<div class="dashboard-body"><div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Loading guarantor requests...</p></div></div>';
            try {
                const r = await callServer('getGuarantorRequests', {memberId: memberId, actorId: memberId}, {force:true});
                if (!r || !r.success) throw new Error((r && r.message) || 'Could not load guarantor requests.');
                const requests = r.requests || [];
                const pending = requests.filter(x => String(x.status || 'pending') === 'pending' && String(x.guarantor_status || 'pending') === 'pending');
                const history = requests.filter(x => !(String(x.status || 'pending') === 'pending' && String(x.guarantor_status || 'pending') === 'pending'));
                let html = '<div class="dashboard-body"><div class="page-header"><div><h2><i class="fas fa-user-shield"></i> Guarantor Requests</h2><p>Review requests, see your response history, and track the loan after disbursement.</p></div></div>';
                if (!pending.length) {
                    html += '<div class="empty-state section-card"><i class="fas fa-user-check"></i><h3>No action required</h3><p>New guarantee requests will appear here when a member selects you.</p></div>';
                } else {
                    html += '<div class="section-title" style="margin:18px 0 10px;"><i class="fas fa-bell"></i> Requests Awaiting Your Response</div>';
                    pending.forEach(function(x){
                        const applicant=x.applicant||{};
                        const days=Number(x.repayment_days||0);
                        const interest=(Number(x.interest_rate||0)*100).toFixed(0);
                        html += '<div class="section-card" style="margin-bottom:14px;">' +
                            '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">' +
                            '<div><div style="font-size:16px;font-weight:800;">Guarantee Request</div><div style="font-size:12px;color:var(--gray-500);margin-top:4px;">Applicant: <strong>'+ (applicant.full_name||'Member') +'</strong> · ID '+(applicant.id_number||'N/A')+'</div></div>' +
                            '<span class="type-badge pending">Action Required</span></div>' +
                            '<div class="metric-grid" style="margin-top:14px;grid-template-columns:repeat(4,minmax(120px,1fr));">' +
                            '<div class="metric-surface"><div class="metric-label">Loan Amount</div><div class="metric-value">KES '+formatGuarantorMoney(x.amount)+'</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Interest</div><div class="metric-value">'+interest+'%</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Return Period</div><div class="metric-value">'+days+' days</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Total to Repay</div><div class="metric-value">KES '+formatGuarantorMoney(x.total_repayment)+'</div></div></div>' +
                            '<div style="margin-top:12px;padding:12px;background:var(--gray-50);border-radius:10px;font-size:12px;display:grid;gap:5px;">' +
                            '<div><strong>Guarantor responsibility:</strong> Review the amount, interest and repayment period before accepting.</div>' +
                            '<div>Applied: '+(x.application_date?new Date(x.application_date).toLocaleString('en-KE'):'—')+'</div>' +
                            '<div>Your response: <strong>'+String(x.guarantor_status||'pending').toUpperCase()+'</strong></div>' +
                            '<div>Other guarantor: <strong>'+((String(x.guarantor_status||'pending').toLowerCase()==='pending') ? (String(x.guarantor1_status||'pending').toUpperCase()==='PENDING' ? String(x.guarantor2_status||'pending').toUpperCase() : String(x.guarantor1_status||'pending').toUpperCase()) : (String(x.guarantor1_status||'pending').toUpperCase()===String(x.guarantor_status||'pending').toUpperCase() ? String(x.guarantor2_status||'pending').toUpperCase() : String(x.guarantor1_status||'pending').toUpperCase()))+'</strong></div>' +
                            '<div>Final admin approval happens only after both guarantors respond.</div></div>' +
                            '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap;"><button class="btn-outline" onclick="respondToGuarantorRequest(\''+x.id+'\',\'rejected\')"><i class="fas fa-times"></i> Decline</button><button class="btn-primary" onclick="respondToGuarantorRequest(\''+x.id+'\',\'accepted\')"><i class="fas fa-check"></i> Accept Guarantee</button></div>' +
                            '</div>';
                    });
                }
                html += '<div class="section-title" style="margin:22px 0 10px;"><i class="fas fa-clock-rotate-left"></i> Guarantee History</div>';
                if (!history.length) {
                    html += '<div class="empty-state section-card"><i class="fas fa-history"></i><h3>No guarantee history yet</h3><p>Your accepted or declined guarantees will remain here for reference.</p></div>';
                } else {
                    history.forEach(function(x){
                        const applicant=x.applicant||{};
                        const status=String(x.guarantor_status||'pending');
                        const active=String(x.status||'')==='active';
                        const completed=String(x.status||'')==='completed' || x.is_fully_paid;
                        const rejected=String(x.status||'')==='rejected' || status==='rejected';
                        const total=Number(x.total_repayment||0);
                        const paid=Number(x.amount_paid||0);
                        const remaining=Math.max(0,total-paid);
                        const progress=total>0 ? Math.min(100, Math.max(0, (paid/total)*100)) : 0;
                        const statusText=completed?'Loan Completed':rejected?'Declined':active?'Active Loan':(x.both_guarantors_responded ? 'Awaiting Admin Final Decision' : 'Awaiting Other Guarantor');
                        html += '<div class="section-card" style="margin-bottom:14px;opacity:.98;">' +
                            '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">' +
                            '<div><div style="font-size:15px;font-weight:800;">Guarantee History</div><div style="font-size:12px;color:var(--gray-500);margin-top:4px;">Borrower: <strong>'+ (applicant.full_name||'Member') +'</strong> · ID '+(applicant.id_number||'N/A')+'</div></div>' +
                            '<span class="type-badge '+(completed?'completed':rejected?'rejected':active?'active':'pending')+'">'+statusText+'</span></div>' +
                            '<div class="metric-grid" style="margin-top:14px;grid-template-columns:repeat(4,minmax(120px,1fr));">' +
                            '<div class="metric-surface"><div class="metric-label">Loan Amount</div><div class="metric-value">KES '+formatGuarantorMoney(x.amount)+'</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Interest</div><div class="metric-value">'+(Number(x.interest_rate||0)*100).toFixed(0)+'%</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Amount Paid</div><div class="metric-value">KES '+formatGuarantorMoney(paid)+'</div></div>' +
                            '<div class="metric-surface"><div class="metric-label">Balance</div><div class="metric-value">KES '+formatGuarantorMoney(remaining)+'</div></div></div>' +
                            '<div style="margin-top:12px;padding:12px;background:var(--gray-50);border-radius:10px;font-size:12px;display:grid;gap:5px;">' +
                            '<div><strong>Your response:</strong> '+status.toUpperCase()+(x.guarantor_responded_at?' · '+new Date(x.guarantor_responded_at).toLocaleString('en-KE'):'')+'</div>' +
                            '<div><strong>Guarantor responses:</strong> G1 '+String(x.guarantor1_status||'pending').toUpperCase()+' · G2 '+String(x.guarantor2_status||'pending').toUpperCase()+'</div>' +
                            '<div><strong>Repayment period:</strong> '+(Number(x.repayment_days||0))+' days</div>' +
                            '<div><strong>Disbursed:</strong> '+(x.approved_date?new Date(x.approved_date).toLocaleString('en-KE'):'Not yet disbursed')+'</div>' +
                            '<div><strong>Due date:</strong> '+(x.repayment_due_date?new Date(x.repayment_due_date).toLocaleString('en-KE'):'Not yet set')+'</div>' +
                            '<div><strong>Total repayment:</strong> KES '+formatGuarantorMoney(total)+'</div>' +
                            (active || completed ? '<div><strong>Repayment progress:</strong> '+progress.toFixed(1)+'% · KES '+formatGuarantorMoney(paid)+' paid of KES '+formatGuarantorMoney(total)+' · KES '+formatGuarantorMoney(remaining)+' remaining</div>' +
                            '<div style="margin-top:8px;height:10px;background:#e5e7eb;border-radius:999px;overflow:hidden;"><div style="height:100%;width:'+progress.toFixed(1)+'%;background:linear-gradient(90deg,#16a34a,#22c55e);border-radius:999px;"></div></div>' : '') +
                            '</div></div>';
                    });
                }
                html += '</div>';
                body.innerHTML=html;
                const badge=document.getElementById('guarantorBadge'); if(badge){badge.textContent=pending.length;badge.style.display=pending.length?'inline-flex':'none';}
            } catch(e) { body.innerHTML='<div class="dashboard-body"><div class="empty-state section-card"><i class="fas fa-triangle-exclamation"></i><h3>Could not load guarantor requests</h3><p>'+String(e.message||e)+'</p></div></div>'; }
        }
        async function loadGuarantorRequests() {
            const memberId = getCanonicalMemberId();
            if (!memberId) return;
            try {
                const r = await callServer('getGuarantorRequests', {memberId: memberId, actorId: memberId});
                if (r && r.success && r.requests) {
                    const pending=r.requests.filter(function(x){ return String(x.guarantor_status||'pending').toLowerCase()==='pending' && String(x.status||'pending').toLowerCase()==='pending'; });
                    const badge=document.getElementById('guarantorBadge'); if(badge){badge.textContent=pending.length;badge.style.display=pending.length?'inline-flex':'none';}
                    const menu=document.getElementById('nav-guarantors'); if(menu) menu.style.display='flex';
                }
                return r;
            } catch(e) { console.warn('Guarantor requests:', e); return null; }
        }
        async function respondToGuarantorRequest(loanId, decision) {
            const memberId = getCanonicalMemberId(); if (!memberId) return;
            let reason=''; if(decision==='rejected'){ reason=(prompt('Please give a reason for declining this guarantee:')||'').trim(); if(!reason)return; }
            const r=await callServer('respondToGuarantorRequest',{memberId:memberId,loanId:loanId,decision:decision,reason:reason,actorId:memberId},{force:true});
            if(typeof showToast==='function') showToast(r.message || 'Response recorded.', r.success?'success':'error');
            if(r.success) { await loadGuarantorRequestsPage(); loadGuarantorRequests(); }
            return r;
        }
        function backToPublicHome() {
            try { history.replaceState({brightlife:'public'}, '', '#home'); } catch(e) {}
            var auth=document.getElementById('app');
            if(auth && auth.classList) auth.classList.remove('registration-mode');
            showPublicHome();
        }

        window.addEventListener('popstate', function(){
            var h=(location.hash||'').replace('#','');
            var secureRouteMap={dashboard:1,savings:1,loans:1,loanmanagement:1,guarantors:1,repayments:1,transactions:1,reports:1,profile:1,messages:1,settings:1,contentmanagement:1,adminsettings:1,admin:1,members:1,alltransactions:1,executive:1,chat:1,rights:1};
            if(h==='member-login'){ openMemberLogin(false); return; }
            if(h==='member-registration'){ openMemberRegistration(false); return; }
            if(['about','programs','approach','finance','membership','projects','partner','contact'].indexOf(h)>=0){ showBrightlifeInnerPage(h,false); return; }
            if(secureRouteMap[h]){ if(getCanonicalMemberId()) navigateTo(h); else openMemberLogin(false); return; }
            if(h.indexOf('project-')===0 || h==='trainings'){ if(getCanonicalMemberId() || h==='trainings') navigateTo(h); else showPublicHome(false); return; }
            if(h==='home'||!h){ showPublicHome(false); }
        });

        function showPublicHome(pushHistory) {
            try {
                if (location.hash !== '#home') {
                    if (pushHistory === false) history.replaceState({brightlife:'public-home'}, '', '#home');
                    else history.pushState({brightlife:'public-home'}, '', '#home');
                }
            } catch(e) {}
            var mainWrapper=document.getElementById('mainWrapper');
            if(mainWrapper && mainWrapper.classList) mainWrapper.classList.add('public-site-mode');
            var publicHome = document.getElementById('publicHomeLanding');
            var projectPage = document.getElementById('publicProjectPage');
            var auth = document.getElementById('app');
            var dashboard = document.getElementById('dashboard');
            var memberTopbar = document.getElementById('memberTopbar');
            var publicSidebar=document.getElementById('publicSidebarSection');
            if (publicHome) publicHome.style.display = 'none';
            if (projectPage) { projectPage.style.display = 'none'; projectPage.innerHTML = ''; }
            if (publicSidebar) publicSidebar.style.display = 'none';
            if (auth) auth.style.display = 'none';
            if (dashboard) { dashboard.style.display = 'block'; dashboard.classList.add('brightlife-public-mode'); }
            if (memberTopbar) { memberTopbar.style.display = 'none'; memberTopbar.setAttribute('aria-hidden','true'); }
            var publicSidebarEl=document.getElementById('sidebar');
            if(publicSidebarEl){ publicSidebarEl.style.display='none'; publicSidebarEl.classList.remove('visible','open'); publicSidebarEl.setAttribute('aria-hidden','true'); }
            var sidebarOverlayEl=document.getElementById('sidebarOverlay');
            if(sidebarOverlayEl){ sidebarOverlayEl.classList.remove('show'); sidebarOverlayEl.style.display='none'; }
            var mobileToggleEl=document.getElementById('mobileMenuToggle');
            if(mobileToggleEl) mobileToggleEl.style.display='none';
            hideSidebar();
            var homeSidebar=document.getElementById('sidebar'); if(homeSidebar) homeSidebar.style.zIndex='';
            loadPublicHomePage();
            window.scrollTo(0, 0);
        }

        function viewPublicLandingPage() {
            showPublicHome();
            try { history.pushState({brightlife:'public-home'}, '', '#home'); } catch(e) {}
        }

        function openMemberLogin(pushHistory) {
            if(pushHistory !== false){ try { history.pushState({brightlife:'login'}, '', '#member-login'); } catch(e) {} }
            document.body.classList.remove('public-site-body','workspace-active');
            document.documentElement.classList.remove('public-site-html');
            var mainWrapper=document.getElementById('mainWrapper');
            if(mainWrapper && mainWrapper.classList) mainWrapper.classList.remove('public-site-mode');
            var publicHome = document.getElementById('publicHomeLanding');
            var auth = document.getElementById('app');
            if (publicHome) publicHome.style.display = 'none';
            if (auth) { auth.style.display = 'block'; auth.classList.remove('registration-mode'); }
            showTab('login');
            window.scrollTo(0, 0);
        }

        function openMemberRegistration(pushHistory) {
            if(pushHistory !== false){ try { history.pushState({brightlife:'registration'}, '', '#member-registration'); } catch(e) {} }
            document.body.classList.remove('public-site-body','workspace-active');
            document.documentElement.classList.remove('public-site-html');
            var mainWrapper=document.getElementById('mainWrapper');
            if(mainWrapper && mainWrapper.classList) mainWrapper.classList.remove('public-site-mode');
            var publicHome = document.getElementById('publicHomeLanding');
            var auth = document.getElementById('app');
            if (publicHome) publicHome.style.display = 'none';
            if (auth) { auth.style.display = 'block'; auth.classList.add('registration-mode'); }
            showTab('register');
            window.scrollTo(0, 0);
        }

        function closePublicDropdowns(){
            document.querySelectorAll('.public-nav-group.open').forEach(function(group){
                group.classList.remove('open');
                var trigger=group.querySelector('.public-nav-group-trigger');
                if(trigger) trigger.setAttribute('aria-expanded','false');
            });
        }
        function togglePublicDropdown(trigger){
            var group=trigger && trigger.closest ? trigger.closest('.public-nav-group') : null;
            if(!group) return;
            var wasOpen=group.classList.contains('open');
            closePublicDropdowns();
            if(!wasOpen){ group.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
        }
        document.addEventListener('click', function(e){
            if(!e.target.closest('.public-nav-group')) closePublicDropdowns();
        });

        function toggleBrightlifeInnerMenu(event){
            if(event && event.stopPropagation) event.stopPropagation();
            var nav=document.getElementById('brightlifeInnerNav');
            var toggle=document.querySelector('.bl-inner-menu-toggle');
            if(!nav) return;
            var open=nav.classList.toggle('is-open');
            if(toggle){
                toggle.setAttribute('aria-expanded',open?'true':'false');
                toggle.setAttribute('aria-label',open?'Close website menu':'Open website menu');
                var icon=toggle.querySelector('i');
                if(icon) icon.className=open?'fas fa-xmark':'fas fa-bars';
            }
        }
        function closeBrightlifeInnerMenu(){
            var nav=document.getElementById('brightlifeInnerNav');
            var toggle=document.querySelector('.bl-inner-menu-toggle');
            if(nav) nav.classList.remove('is-open');
            if(toggle){
                toggle.setAttribute('aria-expanded','false');
                toggle.setAttribute('aria-label','Open website menu');
                var icon=toggle.querySelector('i');
                if(icon) icon.className='fas fa-bars';
            }
        }

        function showBrightlifeInnerPage(page, pushHistory){
            var el=document.getElementById('publicHomeContent');
            var landing=document.getElementById('publicHomeLanding');
            var app=document.getElementById('app');
            var dashboard=document.getElementById('dashboard');
            var mainWrapper=document.getElementById('mainWrapper');
            if(!el)return;
            if(page==='projects'){ navigateTo('projects'); return; }
            if(landing) landing.style.display='block';
            if(app) app.style.display='none';
            if(dashboard) { dashboard.style.display='none'; dashboard.classList.add('brightlife-public-mode'); }
            var innerSidebar=document.getElementById('sidebar');
            var innerTopbar=document.getElementById('memberTopbar');
            if(innerSidebar){ innerSidebar.style.display='none'; innerSidebar.classList.remove('visible','open'); innerSidebar.setAttribute('aria-hidden','true'); }
            if(innerTopbar){ innerTopbar.style.display='none'; innerTopbar.setAttribute('aria-hidden','true'); }
            if(mainWrapper&&mainWrapper.classList)mainWrapper.classList.add('public-site-mode');

            var pages={
                about:{eyebrow:'ABOUT SND BRIGHTLIFE',title:'Community-led solutions for sustainable development',lead:'We work with people and communities to strengthen skills, livelihoods, financial resilience, opportunity and local ownership.',sections:[
                    ['Who We Are','SND Brightlife CBO is a community-based organization focused on improving the social and economic wellbeing of individuals, families and communities through practical programmes and community participation.'],
                    ['Our Mission','To empower individuals and communities through financial inclusion, clean water, education, skills development, sustainable agriculture, entrepreneurship and community-driven programmes.'],
                    ['Our Vision','To build empowered, healthy, financially resilient and self-reliant communities where people have opportunities to improve their livelihoods and create brighter futures.'],
                    ['Who We Serve','Our work is designed around women, youth, children, smallholder farmers, low-income households, aspiring entrepreneurs and vulnerable families.'],
                    ['Our Way of Working','We listen to community priorities, plan with local people, mobilize resources, implement practical initiatives, learn from results and strengthen local ownership.'] ]},
                programs:{eyebrow:'OUR PROGRAMMES',title:'Practical programmes that create opportunity',lead:'Our programme portfolio responds to community needs across livelihoods, education, skills, financial capability, wellbeing and local economic opportunity.',cards:[
                    ['Clean Water, Sanitation & Healthy Communities','Improving access to safe and affordable drinking water through treatment and vending solutions, hygiene and sanitation awareness, community ownership and local enterprise opportunities.','fa-droplet'],
                    ['Education, Mentorship & Digital Literacy','Supporting learning materials, vulnerable learners, career guidance, mentorship, digital literacy and pathways to further education, training and opportunity.','fa-graduation-cap'],
                    ['Youth Skills & Employability','Market-relevant vocational, technical, digital, agricultural and entrepreneurship skills that can support employment and self-employment.','fa-users'],
                    ['Women’s Economic Empowerment & Livelihoods','Supporting women through savings, financial literacy, enterprise, agriculture, poultry, food production, value addition, skills and leadership opportunities.','fa-venus'],
                    ['Sustainable Agriculture & Poultry','Promoting poultry housing, flock management, feeding and nutrition, disease prevention, production, record keeping, budgeting, marketing and responsible reinvestment.','fa-seedling'],
                    ['Entrepreneurship & Small Business Development','Helping entrepreneurs identify opportunities, plan businesses, understand customers, manage pricing and costs, keep records, access markets and reinvest for growth.','fa-store'],
                    ['Financial Literacy & Financial Empowerment','Building practical knowledge in saving, budgeting, responsible borrowing, debt management, business finance, digital financial services and financial goals.','fa-coins'],
                    ['Community Development','Supporting community-led priorities in water, education, skills, livelihoods, environmental responsibility, health, participation and local ownership.','fa-people-group'] ]},
                approach:{eyebrow:'OUR APPROACH',title:'Listen. Learn. Build. Grow Together.',lead:'Brightlife believes communities should not only be beneficiaries of development — they should be active participants in creating it.',steps:[
                    ['Listen','Understand community needs, priorities and aspirations.','fa-comments'],['Identify Priorities','Focus resources on practical needs and opportunities.','fa-list-check'],['Plan Together','Work with communities and partners to design realistic actions.','fa-people-arrows'],['Implement','Turn plans into skills, services, enterprises and community initiatives.','fa-hands-holding-circle'],['Measure Impact','Track progress, learn from experience and improve delivery.','fa-chart-line'],['Strengthen Local Ownership','Support communities to sustain and grow what they build.','fa-seedling'] ],sections:[
                    ['Community Participation','Communities should have a meaningful role in identifying priorities, shaping activities, implementing solutions and strengthening sustainability.'],
                    ['Accountability & Learning','We emphasize clear processes, responsible use of resources, records, communication, reflection and continuous improvement.'] ]},
                finance:{eyebrow:'FINANCIAL EMPOWERMENT',title:'Save. Learn. Build. Empower. Grow.',lead:'The Members’ Table Banking & Revolving Fund combines consistent saving, responsible borrowing, financial literacy, accountability and mutual support.',finance:true},
                membership:{eyebrow:'MEMBERSHIP',title:'Join. Save. Learn. Grow. Build Your Future.',lead:'Membership connects people to community programmes, savings, financial literacy and eligible member services under the CBO’s applicable rules.',membership:true},
                projects:{eyebrow:'PROJECTS & COMMUNITY INITIATIVES',title:'From community priorities to practical action',lead:'Explore the areas in which Brightlife develops or supports practical community initiatives. Verified project updates can be published as activities and outcomes become available.',projects:true},
                partner:{eyebrow:'PARTNER WITH US',title:'Build brighter communities together',lead:'We welcome responsible partnerships that strengthen community programmes and expand practical opportunities.',sections:[
                    ['Programme Partnerships','Partners can support clean water, education, vocational training, agriculture, entrepreneurship, financial literacy, women and youth empowerment and community development.'],
                    ['Skills & Training','Technical expertise, mentorship, training resources and market linkages can help communities turn learning into practical opportunity.'],
                    ['Community Investment','Partnerships should strengthen local participation, accountability, sustainability and measurable community benefit.'] ]},
                contact:{eyebrow:'CONTACT SND BRIGHTLIFE',title:'Let’s start a conversation',lead:'For membership, programmes, partnerships, training or general enquiries, use the official contacts below.',contact:true}
            };
            var d=pages[page]||pages.about;

            var html='<div class="bl-inner-page">'+brightlifePublicHeader_(page)+'<main><section class="bl-inner-hero"><div><span class="bl-eyebrow">'+escapeHtml(d.eyebrow)+'</span><h1>'+escapeHtml(d.title)+'</h1><p>'+escapeHtml(d.lead)+'</p><div class="bl-page-actions"><button class="public-btn public-btn-outline" onclick="showPublicHome()"><i class="fas fa-arrow-left"></i> Back to Home</button>'+(page==='membership'?'<button class="public-btn public-btn-primary" onclick="openMemberRegistration()"><i class="fas fa-user-plus"></i> Become a Member</button>':'')+'</div></div><div class="bl-hero-side"><strong>Save. Learn. Build. Empower. Grow.</strong><span>Community-led solutions for sustainable development.</span></div></section>';
            if(d.cards){html+='<section class="bl-inner-section"><div class="bl-section-title"><span>PROGRAMME AREAS</span><h2>What we do</h2></div><div class="bl-grid">'+d.cards.map(function(c){return '<article class="bl-card"><div class="bl-icon"><i class="fas '+c[2]+'"></i></div><h3>'+escapeHtml(c[0])+'</h3><p>'+escapeHtml(c[1])+'</p><button onclick="showBrightlifeInnerPage(\'contact\')">Enquire <i class="fas fa-arrow-right"></i></button></article>';}).join('')+'</div></section>'}
            if(d.steps){html+='<section class="bl-inner-section alt"><div class="bl-section-title"><span>HOW WE WORK</span><h2>A practical community-led pathway</h2></div><div class="bl-steps">'+d.steps.map(function(c,i){return '<article><div class="bl-step-no">0'+(i+1)+'</div><div class="bl-icon"><i class="fas '+c[2]+'"></i></div><h3>'+escapeHtml(c[0])+'</h3><p>'+escapeHtml(c[1])+'</p></article>';}).join('')+'</div></section>'}
            if(d.sections){html+='<section class="bl-inner-section"><div class="bl-content-list">'+d.sections.map(function(c){return '<article><h2>'+escapeHtml(c[0])+'</h2><p>'+escapeHtml(c[1])+'</p></article>';}).join('')+'</div></section>'}
            if(d.finance){
                html+='<section class="bl-inner-section"><div class="bl-section-title"><span>MEMBERS’ TABLE BANKING &amp; REVOLVING FUND</span><h2>More Than Access to a Loan</h2><p>The Fund is built around saving, responsible borrowing, financial literacy, accountability and mutual support.</p></div><div class="bl-grid">';
                [['Membership & Savings','Registration fee: KES 500. Members generally save consistently for at least 3 months before applying for a loan. Savings do not automatically guarantee loan approval.','fa-piggy-bank'],['Borrowing Capacity','Eligible members may qualify for up to 3× eligible savings, subject to Fund rules, repayment history, guarantors, repayment capacity, approval and availability of funds.','fa-arrow-trend-up'],['Normal Loan','New borrowers generally start at KES 5,000–10,000. Normal Loans have a maximum repayment period of 30 days and are subject to the Fund’s approval process.','fa-money-bill-transfer'],['Emergency Loan','For genuine urgent needs. Maximum repayment period: 10 days. Interest: 20%. Same-day processing may be available once all requirements are satisfied.','fa-bolt'],['Financial Literacy','Members are encouraged to understand saving, household budgeting, financial planning, responsible borrowing, debt management, business finance and digital financial services.','fa-book-open'],['Safe & Transparent Transactions','All Fund payments must use the official SND Brightlife CBO payment channel. Members should keep transaction confirmations and ensure records are updated.','fa-shield-halved']].forEach(function(c){html+='<article class="bl-card"><div class="bl-icon"><i class="fas '+c[2]+'"></i></div><h3>'+escapeHtml(c[0])+'</h3><p>'+escapeHtml(c[1])+'</p></article>';});
                html+='</div></section>';
                html+='<section class="bl-inner-section alt"><div class="bl-section-title"><span>NORMAL LOAN TERMS</span><h2>Repayment period and interest</h2><p>The applicable interest rate depends on the agreed repayment period.</p></div><div class="bl-loan-table"><div><strong>1–7 days</strong><span>12%</span></div><div><strong>8–14 days</strong><span>16%</span></div><div><strong>15–20 days</strong><span>18%</span></div><div><strong>21–30 days</strong><span>20%</span></div></div><div class="bl-rule-note"><strong>Processing fee: KES 250.</strong><span>At least 2 eligible member guarantors are required. Normal Loans are scheduled for disbursement on the 1st, 10th and 20th, subject to approval, verification and availability of funds.</span></div></section>';
                html+='<section class="bl-inner-section"><div class="bl-content-list"><article><h2>Emergency Loan</h2><p>Emergency Loans are intended for genuine and unexpected urgent needs. They attract 20% interest, have a maximum repayment period of 10 days and a KES 250 processing fee. At least 2 eligible member guarantors are required. Same-day processing does not mean automatic approval.</p></article><article><h2>Loan Eligibility &amp; Responsible Borrowing</h2><p>Members generally need active membership, the required savings record, applicable guarantors, an acceptable repayment record and no overdue loan. Approval depends on eligibility, savings, loan history, repayment capacity, guarantors, Fund rules and available resources.</p></article><article><h2>Repayment &amp; Recovery</h2><p>Members must repay according to the agreed amount and due date. Overdue loans may restrict further borrowing and trigger applicable recovery procedures. Members facing repayment difficulty are encouraged to communicate with the Fund promptly for review under the applicable rules.</p></article></div></section>';
            }
            if(d.membership){html+='<section class="bl-inner-section"><div class="bl-content-list"><article><h2>How Membership Works</h2><p>Register as a member, provide the required identification information, establish your member account and build a consistent savings record.</p></article><article><h2>Registration</h2><p>The client information provides for a KES 500 registration fee and identification/photo requirements. Members should follow the current registration process and provide accurate information.</p></article><article><h2>Savings Before Borrowing</h2><p>Members generally save consistently for at least 3 months before applying for a loan. Savings help establish financial capacity but do not automatically guarantee loan approval.</p></article><article><h2>Member Responsibility</h2><p>Members are expected to provide accurate information, save consistently, borrow responsibly, meet repayment obligations and follow applicable CBO rules.</p></article></div></section><section class="bl-inner-section alt"><div class="bl-section-title"><span>YOUR JOURNEY</span><h2>Join. Save. Learn. Grow. Build Your Future.</h2></div><div class="bl-steps"><article><div class="bl-step-no">01</div><div class="bl-icon"><i class="fas fa-user-plus"></i></div><h3>Join</h3><p>Complete membership registration and establish your account.</p></article><article><div class="bl-step-no">02</div><div class="bl-icon"><i class="fas fa-piggy-bank"></i></div><h3>Save</h3><p>Build a consistent savings habit and financial record.</p></article><article><div class="bl-step-no">03</div><div class="bl-icon"><i class="fas fa-graduation-cap"></i></div><h3>Learn</h3><p>Build financial, enterprise and practical livelihood knowledge.</p></article><article><div class="bl-step-no">04</div><div class="bl-icon"><i class="fas fa-arrow-trend-up"></i></div><h3>Grow</h3><p>Use eligible opportunities responsibly as your record develops.</p></article></div></section>'}
            if(d.projects){html += '<section class="bl-inner-section"><div class="bl-section-title"><span>PROJECTS &amp; COMMUNITY INITIATIVES</span><h2>Explore a project and its published updates</h2><p>Choose a project below to view information published by the authorized administrator or responsible project lead. The project page is the place for current activities, progress, photographs and approved updates.</p></div><div class="bl-grid project-inner-grid">'+
[['Water Supply &amp; Clean Water','Water access, treatment, vending, hygiene and sustainable community water solutions.','water','fa-faucet-drip'],['Poultry Farming','Poultry activities supporting household livelihoods, food security, skills and income opportunities.','poultry','fa-dove'],['Agriculture &amp; Livelihoods','Farming, agribusiness, kitchen gardens, value addition and practical livelihood development.','agriculture','fa-seedling'],['Bike Repair &amp; Vocational Skills','Practical repair skills, workshop safety, customer service and basic business knowledge.','bike_skills','fa-screwdriver-wrench'],['Education Support','Learning support, mentorship, career guidance, digital literacy and life skills.','education','fa-school'],['Entrepreneurship &amp; Small Business','Enterprise skills, small-business development, financial knowledge and income opportunities.','entrepreneurship','fa-store'],['Women Empowerment','Skills, participation, economic opportunities and community leadership for women.','women','fa-person-dress'],['Youth Empowerment','Skills, mentorship, entrepreneurship, digital learning and participation opportunities for young people.','youth','fa-people-arrows'],['Community Development','Community-led initiatives supporting water, education, agriculture, skills, environment and wellbeing.','community_development','fa-people-roof']].map(function(c){return '<article class="bl-card project-inner-card"><div class="bl-icon"><i class="fas '+c[3]+'"></i></div><h3>'+c[0]+'</h3><p>'+c[1]+'</p><button type="button" class="public-btn public-btn-primary project-inner-view" onclick="showSelectedProjectUpdatesPage(\''+c[0].replace(/&amp;/g,'&')+'\',\''+c[2]+'\')">View Project <i class="fas fa-arrow-right"></i></button></article>';}).join('')+'</div></section><section class="bl-inner-section alt"><div class="bl-content-list"><article><h2>Published Project Information</h2><p>Project updates shown on this website are intended to reflect information that has been reviewed and published by the authorized administration or responsible project lead.</p></article><article><h2>Community Impact</h2><p>Our projects connect community priorities with practical skills, livelihoods, financial resilience, wellbeing and stronger local ownership.</p></article></div></section>'; }
            if(d.contact){html+='<section class="bl-inner-section"><div class="bl-contact-grid"><a href="tel:+254711765739"><i class="fas fa-phone"></i><span>Phone / WhatsApp</span><strong>+254 711 765 739</strong></a><a href="mailto:sndbrightlife@gmail.com"><i class="fas fa-envelope"></i><span>Email</span><strong>sndbrightlife@gmail.com</strong></a><a href="https://wa.me/254711765739" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i><span>WhatsApp</span><strong>Chat with SND Brightlife</strong></a><div><i class="fas fa-handshake"></i><span>Membership &amp; Partnerships</span><strong>Contact the CBO for the appropriate next step.</strong></div></div></section>'}
            html+='<section class="bl-cta"><div><span>YOUR JOURNEY STARTS WITH BRIGHTLIFE</span><h2>Join. Save. Learn. Grow. Build Your Future.</h2><p>Explore our programmes, become a member, or start a conversation with Brightlife.</p></div><div><button class="public-btn public-btn-light" onclick="openMemberRegistration()">Become a Member</button><button class="public-btn public-btn-transparent" onclick="showPublicHome()"><i class="fas fa-arrow-left"></i> Back to Home</button></div></section></main><footer class="bl-inner-footer"><strong>SND Brightlife CBO</strong><span>Empowering People. Building Livelihoods. Transforming Communities.</span><span>+254 711 765 739 · sndbrightlife@gmail.com</span></footer></div>';
            el.innerHTML=html;
            window.scrollTo(0,0);
            if(pushHistory!==false){try{history.pushState({brightlife:'inner',page:page},'', '#'+page);}catch(e){}}
        }

        function renderPublicHomeLanding() {
            var el = document.getElementById('publicHomeContent');
            if (!el) return;
            el.innerHTML = `
                <div class="brightlife-public-page" id="brightlife-public-page">
                    <header class="public-main-header">
                        <div class="public-header-inner">
                            <button type="button" class="public-brand" onclick="scrollPublicSection('public-home','home')" aria-label="SND Brightlife CBO Home">
                                <img src="https://i.ibb.co/Tx5GPpmN/Whats-App-Image-2026-09-04-at-09-51-28.jpg" alt="SND Brightlife CBO">
                                <span><strong>SND Brightlife CBO</strong><small>Community - Led Solutions for Sustainable Development</small></span>
                            </button>
                            <nav class="public-main-nav" aria-label="Main navigation">
                                <button type="button" class="public-main-link active" data-public-nav="home" onclick="scrollPublicSection('public-home','home')">Home</button>
                                <a class="public-main-link" data-public-nav="approach" href="#approach" onclick="event.preventDefault();showBrightlifeInnerPage('approach')">Our Approach</a>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Discover <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <a role="menuitem" href="#about" onclick="event.preventDefault();showBrightlifeInnerPage('about')">About Us</a>
                                        <a role="menuitem" href="#programs" onclick="event.preventDefault();showBrightlifeInnerPage('programs')">Our Programmes</a>
                                        <a role="menuitem" href="#projects" onclick="event.preventDefault();showBrightlifeInnerPage('projects')">Projects</a>
                                    </div>
                                </div>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Member Services <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <a role="menuitem" href="#finance" onclick="event.preventDefault();showBrightlifeInnerPage('finance')">Financial Empowerment</a>
                                        <a role="menuitem" href="#membership" onclick="event.preventDefault();showBrightlifeInnerPage('membership')">Membership</a>
                                    </div>
                                </div>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Connect <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <a role="menuitem" href="#partner" onclick="event.preventDefault();showBrightlifeInnerPage('partner')">Partner With Us</a>
                                        <a role="menuitem" href="#contact" onclick="event.preventDefault();showBrightlifeInnerPage('contact')">Contact Us</a>
                                    </div>
                                </div>
                                <a class="public-login-button" href="index.html?member=login">Member Login</a>
                            </nav>
                        </div>
                    </header>

                    <main id="public-home" class="public-main-content">
                        <section class="public-hero-section public-anchor" id="public-hero">
                            <div class="public-hero-copy">
                                <div class="public-kicker">SND BRIGHTLIFE CBO</div>
                                <h1>Empowering People. Building Livelihoods. Transforming Communities.</h1>
                                <p class="public-lead"><strong>Welcome to SND Brightlife Community Based Organization (CBO)</strong> — a community-led organization working to strengthen livelihoods, skills, opportunity and community wellbeing.</p>
                                <p>Our work brings together <strong>clean water, education, skills development, agriculture, entrepreneurship, financial literacy, women and youth empowerment, and community development</strong>.</p>
                                <div class="public-hero-actions">
                                    <button class="public-btn public-btn-primary" onclick="scrollPublicSection('public-programs','programs')"><i class="fas fa-layer-group"></i> Explore Our Programs</button>
                                    <button class="public-btn public-btn-light" onclick="openMemberRegistration()"><i class="fas fa-user-plus"></i> Become a Member</button>
                                </div>
                            </div>
                            <div class="public-hero-panel">
                                <span class="public-panel-kicker">OUR APPROACH</span>
                                <h2>Save. Learn. Build. Empower. Grow.</h2>
                                <p>We connect financial discipline with practical skills, enterprise opportunities and community-led development so that members and communities can build stronger futures.</p>
                                <div class="public-panel-points"><span><i class="fas fa-check-circle"></i> Community driven</span><span><i class="fas fa-check-circle"></i> Opportunity focused</span><span><i class="fas fa-check-circle"></i> Responsible growth</span></div>
                            </div>
                        </section>

                        <section id="public-about" class="public-section public-section-light public-anchor">
                            <div class="public-section-heading"><span class="public-kicker">ABOUT US</span><h2>Community empowerment with practical livelihood solutions.</h2><p>SND Brightlife CBO focuses on social and economic wellbeing by combining community empowerment, financial inclusion and practical livelihood programmes.</p></div>
                            <div class="public-about-grid">
                                <article class="public-card public-about-main"><div class="public-icon"><i class="fas fa-people-group"></i></div><h3>Who We Are</h3><p>SND Brightlife CBO is a community-based organization focused on improving the social and economic wellbeing of individuals, families and communities.</p><p>Our approach brings together savings and responsible member financing with clean water, education, vocational skills, agriculture, entrepreneurship, women and youth empowerment and community development.</p><p>Through our programmes, we aim to help people move from dependency to opportunity, from ideas to sustainable livelihoods and from small beginnings to brighter futures.</p></article>
                                <div class="public-value-stack"><article class="public-card"><div class="public-icon"><i class="fas fa-eye"></i></div><h3>Our Vision</h3><p>To build empowered, healthy, financially resilient and self-reliant communities where everyone has an opportunity to improve their livelihood and create a brighter future.</p></article><article class="public-card"><div class="public-icon"><i class="fas fa-bullseye"></i></div><h3>Our Mission</h3><p>To empower individuals and communities through financial inclusion, clean water, education, skills development, sustainable agriculture, entrepreneurship and community-driven programmes that create lasting social and economic opportunities.</p></article></div>
                            </div>
                        </section>

                        <section id="public-approach" class="public-section public-section-light public-anchor">
                            <div class="public-section-heading"><span class="public-kicker">OUR APPROACH</span><h2>Community-led development with practical pathways.</h2><p>Brightlife's approach is grounded in listening to communities, building practical capacity and connecting people to opportunities that can strengthen livelihoods.</p></div>
                            <div class="public-trust-grid">
                                <article class="public-card"><div class="public-icon"><i class="fas fa-comments"></i></div><h3>Listen</h3><p>Understand community needs, priorities, aspirations and local opportunities.</p></article>
                                <article class="public-card"><div class="public-icon"><i class="fas fa-graduation-cap"></i></div><h3>Learn</h3><p>Promote practical learning, mentorship, financial literacy and market-relevant skills.</p></article>
                                <article class="public-card"><div class="public-icon"><i class="fas fa-hammer"></i></div><h3>Build</h3><p>Support people to turn skills, savings, ideas and opportunities into livelihoods and enterprises.</p></article>
                                <article class="public-card public-growing-card"><div class="public-icon"><i class="fas fa-people-group"></i></div><h3>Grow Together</h3><p>Strengthen local ownership, responsible participation and opportunities that can benefit others.</p></article>
                            </div>
                        </section>

                        <section id="public-programs" class="public-section public-section-tinted public-anchor">
                            <div class="public-section-heading"><span class="public-kicker">OUR PROGRAMS</span><h2>Practical programmes that create opportunity.</h2><p>Brightlife does more than provide financial services. Our programmes are designed to strengthen livelihoods, skills, wellbeing and community resilience.</p></div>
                            <div class="public-program-grid">
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-droplet"></i></div><h3>Clean Water Treatment &amp; Vending</h3><p>Providing communities with access to safe, affordable drinking water while promoting sanitation, hygiene and sustainable water solutions.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-bicycle"></i></div><h3>Bike Repair &amp; Vocational Skills</h3><p>Equipping young people with practical bicycle and motorcycle repair skills that can lead to employment, self-employment and small-business opportunities.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-dove"></i></div><h3>Poultry Farming &amp; Agriculture</h3><p>Supporting poultry and agricultural initiatives that improve food security, household income, entrepreneurship and sustainable livelihoods.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-graduation-cap"></i></div><h3>Education Support</h3><p>Supporting learning, mentorship, vocational training, digital skills and educational opportunities for children and young people.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-venus"></i></div><h3>Women Empowerment</h3><p>Helping women strengthen their economic independence through skills, savings, entrepreneurship, agriculture and community leadership.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-users"></i></div><h3>Youth Empowerment</h3><p>Connecting young people with skills, mentorship, entrepreneurship, agriculture, technology and income-generating opportunities.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-store"></i></div><h3>Entrepreneurship &amp; Small Business</h3><p>Encouraging viable enterprises through practical skills, financial knowledge, business discipline and community-based support.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-chart-line"></i></div><h3>Financial Literacy</h3><p>Practical education covering saving, budgeting, responsible borrowing, debt management, record keeping and business planning.</p></article>
                                <article class="public-card public-program-card"><div class="public-icon"><i class="fas fa-people-roof"></i></div><h3>Community Development</h3><p>Community participation in clean water, education, agriculture, skills training, environmental conservation, health awareness, youth, women and welfare initiatives.</p></article>
                            </div>
                            <div class="public-project-cta" style="margin-top:24px;"><div><span class="public-kicker">DETAILED PROGRAMME INFORMATION</span><h3>Explore programme pages and published project updates.</h3><p>Go beyond the homepage to see the purpose, activities and approved updates for each programme area.</p></div><button class="public-btn public-btn-primary" onclick="navigateTo('projects')">Explore Our Programmes <i class="fas fa-arrow-right"></i></button></div>
                        </section>

                        <section id="public-save-borrow" class="public-section public-section-light public-anchor">
                            <div class="public-section-heading"><span class="public-kicker">SAVE &amp; BORROW</span><h2>Members’ Table Banking &amp; Revolving Fund</h2><p>Our Members’ Table Banking &amp; Revolving Fund encourages members to save consistently, build financial discipline, and access responsible short-term financing based on their savings, repayment history, guarantors, and Fund rules.</p></div>
                            <div class="public-finance-grid">
                                <article class="public-card public-finance-card"><div class="public-icon"><i class="fas fa-piggy-bank"></i></div><h3>Save With Us</h3><p>Build a consistent savings habit, strengthen your financial security, and grow your future borrowing capacity.</p><button class="public-inline-link" onclick="openMemberLogin()">Start Saving <i class="fas fa-arrow-right"></i></button></article>
                                <article class="public-card public-finance-card"><div class="public-icon"><i class="fas fa-hand-holding-dollar"></i></div><h3>Borrow Responsibly</h3><p>Eligible members can access loans based on savings, membership history, repayment performance, guarantors, and available funds.</p><button class="public-inline-link" onclick="openMemberLogin()">Apply as a Member <i class="fas fa-arrow-right"></i></button></article>
                                <article class="public-card public-finance-card"><div class="public-icon"><i class="fas fa-bolt"></i></div><h3>Emergency Loan</h3><p>Short-term support for eligible members facing genuine urgent needs, subject to the Fund’s terms, verification, approval and availability of funds.</p><button class="public-inline-link" onclick="showPublicLoanTerms()">View Loan Terms <i class="fas fa-arrow-right"></i></button></article>
                            </div>
                            <div class="public-responsible-note"><div><strong>Responsible member finance</strong><span>Loan decisions remain subject to eligibility, Fund rules, approval requirements and availability of funds.</span></div><button class="public-btn public-btn-outline" onclick="showPublicLoanTerms()">View Loan Terms</button></div>
                        </section>

                        <section id="public-projects" class="public-section public-section-dark public-anchor">
                            <div class="public-section-heading public-heading-light"><span class="public-kicker">PROJECTS &amp; COMMUNITY IMPACT</span><h2>Turning community needs into practical opportunities.</h2><p>Brightlife combines financial inclusion with projects that can improve livelihoods, skills, wellbeing and community resilience.</p></div>
                            <div class="public-impact-grid"><article><i class="fas fa-faucet-drip"></i><strong>Clean Water</strong><span>Safe water, hygiene and sustainable water solutions.</span></article><article><i class="fas fa-seedling"></i><strong>Agriculture</strong><span>Poultry, farming and livelihood opportunities.</span></article><article><i class="fas fa-screwdriver-wrench"></i><strong>Skills</strong><span>Vocational and practical income-generating skills.</span></article><article><i class="fas fa-graduation-cap"></i><strong>Education</strong><span>Learning, mentorship, digital and life skills.</span></article></div>
                            <div class="public-project-cta"><div><span class="public-kicker">EXPLORE OUR WORK</span><h3>See programmes, project updates and community activities.</h3><p>Explore Brightlife's community programmes, projects and practical initiatives designed to create opportunity and improve livelihoods.</p></div><button class="public-btn public-btn-light" onclick="navigateTo('projects')">View Projects</button></div>
                        </section>

                        <section class="public-section public-section-light public-anchor" id="public-trust">
                            <div class="public-section-heading"><span class="public-kicker">WHY BRIGHTLIFE?</span><h2>Built on trust, opportunity and community.</h2><p>Our goal is not simply to lend money, but to help members and communities become more self-reliant.</p></div>
                            <div class="public-trust-grid"><article class="public-card"><div class="public-icon"><i class="fas fa-people-group"></i></div><h3>Community Driven</h3><p>Built around the needs and aspirations of our members and communities.</p></article><article class="public-card"><div class="public-icon"><i class="fas fa-shield-halved"></i></div><h3>Transparent &amp; Accountable</h3><p>Member savings, loans and repayments are properly recorded and managed.</p></article><article class="public-card"><div class="public-icon"><i class="fas fa-lightbulb"></i></div><h3>Opportunity Focused</h3><p>We combine financial support with skills, enterprise and practical livelihood programs.</p></article><article class="public-card public-growing-card"><div class="public-icon"><i class="fas fa-seedling"></i></div><h3>Growing Together</h3><p>We help members and communities build skills, confidence and practical pathways toward greater self-reliance.</p></article></div>
                        </section>

                        <section id="public-membership" class="public-section public-section-tinted public-anchor">
                            <div class="public-membership-card"><div><span class="public-kicker">MEMBERSHIP</span><h2>Join SND Brightlife CBO</h2><h3>Be Part of Something That Grows With You</h3><p>Membership in SND Brightlife CBO provides an opportunity to become part of a community focused on <strong>saving, learning, entrepreneurship, empowerment, and responsible growth.</strong></p><p>Membership may provide access to eligible CBO programmes and the Members' Table Banking &amp; Revolving Fund, subject to applicable membership requirements and programme rules.</p></div><div class="public-membership-actions"><button class="public-btn public-btn-primary" onclick="openMemberRegistration()"><i class="fas fa-user-plus"></i> Join SND Brightlife CBO</button><button class="public-btn public-btn-outline" onclick="openMemberLogin()"><i class="fas fa-id-card"></i> Member Login</button><span>Basic requirements are provided on the Membership page and include registration, identification and account-opening requirements.</span></div></div>
                        </section>

                        <section id="public-partner" class="public-section public-section-dark public-anchor">
                            <div class="public-partner-card"><div><span class="public-kicker">PARTNER WITH US</span><h2>Let’s Build Brighter Communities Together</h2><p>SND Brightlife CBO welcomes partnerships that can help expand the impact of our programmes in clean water, education, vocational training, agriculture, entrepreneurship, financial literacy, women and youth empowerment, environmental sustainability and community development.</p></div><div class="public-partner-actions"><button class="public-btn public-btn-light" onclick="scrollPublicSection('public-contact','contact')"><i class="fas fa-handshake"></i> Partner With Us</button><button class="public-btn public-btn-transparent" onclick="scrollPublicSection('public-contact','contact')"><i class="fas fa-envelope"></i> Get In Touch</button></div></div>
                        </section>

                        <section id="public-contact" class="public-section public-section-light public-anchor">
                            <div class="public-section-heading"><span class="public-kicker">CONTACT US</span><h2>Connect with SND Brightlife CBO.</h2><p>For community programmes, partnerships, training activities and member support, please use our official contact channels.</p></div>
                            <div class="public-contact-panel">
                                <div class="public-contact-grid"><a class="public-contact-card" href="tel:+254711765739"><span class="public-contact-icon"><i class="fab fa-whatsapp"></i></span><span><strong>Phone / WhatsApp</strong><b>+254711765739</b><small>General enquiries and member support.</small></span></a><a class="public-contact-card" href="mailto:sndbrightlife@gmail.com"><span class="public-contact-icon"><i class="fas fa-envelope"></i></span><span><strong>Email</strong><b>sndbrightlife@gmail.com</b><small>Programmes, partnerships and general enquiries.</small></span></a><a class="public-contact-card" href="https://maps.app.goo.gl/nVSWYUMQT6gNao2X7" target="_blank" rel="noopener"><span class="public-contact-icon"><i class="fas fa-location-dot"></i></span><span><strong>Location</strong><b>View our office location</b><small>Open the official map location and plan your visit.</small></span></a><div class="public-contact-card"><span class="public-contact-icon"><i class="fas fa-clock"></i></span><span><strong>Operating Hours</strong><b>07:00 – 18:00</b><small>Member support, enquiries and office services.</small></span></div></div>
                            </div>
                            <div class="public-contact-actions"><button class="public-btn public-btn-primary" onclick="openMemberRegistration()"><i class="fas fa-user-plus"></i> Become a Member</button><button class="public-btn public-btn-outline" onclick="openMemberLogin()"><i class="fas fa-file-signature"></i> Apply for a Loan</button><button class="public-btn public-btn-outline" onclick="scrollPublicSection('public-partner','partner')"><i class="fas fa-handshake"></i> Partner With Us</button><button class="public-btn public-btn-outline" onclick="scrollPublicSection('public-contact','contact')"><i class="fas fa-phone"></i> Contact Us</button></div>
                        </section>
                    </main>

                    <footer class="public-main-footer"><div class="public-footer-brand"><strong>SND Brightlife CBO</strong><span>Members’ Table Banking &amp; Revolving Fund</span></div><div class="public-footer-links"><button onclick="scrollPublicSection('public-home','home')">Home</button><button onclick="showBrightlifeInnerPage('about')">About Us</button><button onclick="showBrightlifeInnerPage('programs')">Our Programmes</button><button onclick="showBrightlifeInnerPage('finance')">Financial Empowerment</button><button onclick="showBrightlifeInnerPage('membership')">Membership</button><button onclick="showBrightlifeInnerPage('projects')">Projects</button><button onclick="showBrightlifeInnerPage('partner')">Partner With Us</button><button onclick="showBrightlifeInnerPage('contact')">Contact Us</button></div><p>Loans and financial services are available only to eligible members and are subject to the Fund’s rules, approval requirements and availability of funds.</p><span class="public-footer-copy">Empowering People. Building Livelihoods. Transforming Communities.</span></footer>
                </div>`;
            applyManagedHomepagePhotos();
            window.scrollTo({top:0,behavior:'auto'});
        }
        function showPublicLoanTerms() {
            var el=document.getElementById('publicHomeContent');
            if(!el) return;
            el.innerHTML=`
                <div class="public-loan-terms">
                    <div class="public-loan-terms-inner">
                        <button class="public-btn public-btn-outline" onclick="renderPublicHomeLanding()"><i class="fas fa-arrow-left"></i> Back to Home</button>
                        <div class="public-loan-terms-card" style="margin-top:18px;">
                            <span class="public-kicker">LOAN TERMS</span>
                            <h1>Members’ Loan Terms</h1>
                            <p>Brightlife keeps detailed financing terms separate from the main homepage so that the website remains focused on community development, saving, responsible borrowing and sustainable livelihoods.</p>
                            <div class="loan-rate-grid">
                                <div class="loan-rate-item"><strong>12%</strong><span>Up to 7 Days</span></div>
                                <div class="loan-rate-item"><strong>16%</strong><span>8–14 Days</span></div>
                                <div class="loan-rate-item"><strong>18%</strong><span>15–20 Days</span></div>
                                <div class="loan-rate-item"><strong>20%</strong><span>21–30 Days</span></div>
                            </div>
                            
                            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;"><button class="public-btn public-btn-primary" onclick="openMemberLogin()"><i class="fas fa-user-lock"></i> Member Login</button><button class="public-btn public-btn-outline" onclick="renderPublicHomeLanding();setTimeout(function(){scrollPublicSection('public-contact','contact')},80)"><i class="fas fa-phone"></i> Contact Us</button></div>
                        </div>
                    </div>
                </div>`;
            window.scrollTo({top:0,behavior:'auto'});
        }
        function showPublicMembershipPage() {
            var mainWrapper=document.getElementById('mainWrapper');
            if(mainWrapper && mainWrapper.classList) mainWrapper.classList.add('public-site-mode');
            var el=document.getElementById('publicHomeContent');
            if(!el) return;
            el.innerHTML=`
                <div class="public-membership-page">
                    <header class="public-main-header">
                        <div class="public-header-inner">
                            <button type="button" class="public-brand" onclick="showPublicHome()" aria-label="SND Brightlife CBO Home">
                                <img src="https://i.ibb.co/Tx5GPpmN/Whats-App-Image-2026-09-04-at-09-51-28.jpg" alt="SND Brightlife CBO">
                                <span><strong>SND Brightlife CBO</strong><small>Community - Led Solutions for Sustainable Development</small></span>
                            </button>
                            <nav class="public-main-nav" aria-label="Main navigation">
                                <button type="button" class="public-main-link" onclick="showPublicHome()">Home</button>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Discover <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <button type="button" role="menuitem" onclick="showPublicHome();setTimeout(function(){scrollPublicSection('public-about','about')},60);closePublicDropdowns()">About Us</button>
                                        <button type="button" role="menuitem" onclick="showPublicHome();setTimeout(function(){scrollPublicSection('public-programs','programs')},60);closePublicDropdowns()">Our Programs</button>
                                        <button type="button" role="menuitem" onclick="navigateTo('projects');closePublicDropdowns()">Projects</button>
                                    </div>
                                </div>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Member Services <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <button type="button" role="menuitem" onclick="showPublicHome();setTimeout(function(){scrollPublicSection('public-save-borrow','finance')},60);closePublicDropdowns()">Save &amp; Borrow</button>
                                        <button type="button" role="menuitem" class="active" onclick="showPublicMembershipPage();closePublicDropdowns()">Membership</button>
                                    </div>
                                </div>
                                <div class="public-nav-group">
                                    <button type="button" class="public-main-link public-nav-group-trigger" aria-haspopup="true" aria-expanded="false" onclick="togglePublicDropdown(this)">Connect <i class="fas fa-chevron-down"></i></button>
                                    <div class="public-nav-dropdown" role="menu">
                                        <button type="button" role="menuitem" onclick="showPublicHome();setTimeout(function(){scrollPublicSection('public-partner','partner')},60);closePublicDropdowns()">Partner With Us</button>
                                        <button type="button" role="menuitem" onclick="showPublicHome();setTimeout(function(){scrollPublicSection('public-contact','contact')},60);closePublicDropdowns()">Contact Us</button>
                                    </div>
                                </div>
                                <a class="public-login-button" href="index.html?member=login">Member Login</a>
                            </nav>
                        </div>
                    </header>
                    <main class="public-membership-main">
                        <div class="public-membership-page-head">
                            <span class="public-kicker">MEMBERSHIP</span>
                            <h1>Membership at SND Brightlife CBO</h1>
                            <p>Join a community where saving, learning, enterprise and practical development come together to create stronger opportunities.</p>
                        </div>
                        <div class="membership-page-grid">
                            <section class="membership-page-card membership-intro-card">
                                <span class="public-kicker">BECOME A MEMBER</span>
                                <h2>Be part of something that grows with you.</h2>
                                <p>Membership gives you an opportunity to become part of a community committed to responsible saving, practical learning, entrepreneurship, empowerment and sustainable development.</p>
                                <p>Eligible members may participate in Brightlife programmes and the Members’ Table Banking &amp; Revolving Fund, subject to membership requirements, programme rules and applicable approval processes.</p>
                                <div class="membership-page-actions">
                                    <button class="public-btn public-btn-primary" onclick="openMemberRegistration()"><i class="fas fa-user-plus"></i> Join SND Brightlife CBO</button>
                                    <button class="public-btn public-btn-outline" onclick="openMemberLogin()"><i class="fas fa-right-to-bracket"></i> Member Login</button>
                                </div>
                            </section>
                            <section class="membership-page-card requirements-card">
                                <span class="public-kicker">MEMBERSHIP REQUIREMENTS</span>
                                <h2>What You Need to Become a Member</h2>
                                <div class="membership-requirement-list">
                                    <div><span class="requirement-icon"><i class="fas fa-money-bill-wave"></i></span><div><strong>KES 500 Registration Fee</strong><p>A one-time fee used to process your membership registration.</p></div></div>
                                    <div><span class="requirement-icon"><i class="fas fa-id-card"></i></span><div><strong>ID Verification</strong><p>Provide valid identification for secure member verification.</p></div></div>
                                    <div><span class="requirement-icon"><i class="fas fa-camera"></i></span><div><strong>Passport Photograph</strong><p>A recent passport-size photograph for your member record.</p></div></div>
                                    <div><span class="requirement-icon"><i class="fas fa-book-open"></i></span><div><strong>Passbook / Account Opening</strong><p>Your passbook and account-opening details are completed during registration.</p></div></div>
                                </div>
                            </section>
                        </div>
                        <section class="membership-next-step">
                            <div><span class="public-kicker">READY TO JOIN?</span><h2>Ready to become a Brightlife member?</h2><p>Start your registration, complete the required details and take the first step toward participating in the Brightlife community.</p></div>
                            <button class="public-btn public-btn-primary" onclick="openMemberRegistration()"><i class="fas fa-arrow-right"></i> Start Registration</button>
                        </section>
                    </main>
                    <footer class="public-main-footer"><div class="public-footer-brand"><strong>SND Brightlife CBO</strong><span>Members’ Table Banking &amp; Revolving Fund</span></div><div class="public-footer-links"><button onclick="showPublicHome()">Home</button><button onclick="showBrightlifeInnerPage('membership')">Membership</button><button onclick="navigateTo('projects')">Projects</button><button onclick="openMemberLogin()">Member Login</button></div><span class="public-footer-copy">Empowering People. Building Livelihoods. Transforming Communities.</span></footer>
                </div>`;
            try { history.pushState({brightlife:'membership'}, '', '#membership'); } catch(e) {}
            window.scrollTo({top:0,behavior:'auto'});
        }

        function escapeHtml(value){
            return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#039;');
        }
        function toggleAccountMenu(event){
            if(event) event.stopPropagation();
            var wrap=document.getElementById('accountMenuWrap'); if(!wrap) return;
            var open=wrap.classList.toggle('open');
            var trigger=wrap.querySelector('.account-trigger'); if(trigger) trigger.setAttribute('aria-expanded',String(open));
        }
        function closeAccountMenu(){
            var wrap=document.getElementById('accountMenuWrap'); if(!wrap) return;
            wrap.classList.remove('open');
            var trigger=wrap.querySelector('.account-trigger'); if(trigger) trigger.setAttribute('aria-expanded','false');
        }
        document.addEventListener('click',function(e){
            var wrap=document.getElementById('accountMenuWrap');
            if(wrap && !wrap.contains(e.target)) closeAccountMenu();
        });
        function updateMemberTopbar(member){
            member=member||{};
            var name=member.name||member.fullName||member.full_name||sessionStorage.getItem('memberName')||'Member';
            var role=member.role||sessionStorage.getItem('memberRole')||'member';
            var initials=name.split(/\s+/).filter(Boolean).map(function(x){return x.charAt(0)}).join('').toUpperCase().slice(0,2)||'M';
            var roleMap={super_admin:'Super Administrator',admin:'Administrator',treasurer:'Treasurer',customer_care:'Customer Care',profile_approver:'Profile Approver',member:'Member'};
            var av=document.getElementById('topAccountAvatar'), nm=document.getElementById('topAccountName'), rl=document.getElementById('topAccountRole');
            if(av) av.textContent=initials; if(nm) nm.textContent=name; if(rl) rl.textContent=roleMap[role]||'Member';
        }
        function setMemberTopbarPage(page,title,subtitle){
            var t=document.getElementById('memberTopbarTitle'),s=document.getElementById('memberTopbarSubtitle');
            if(t) t.textContent=title||'Member Portal'; if(s) s.textContent=subtitle||'Your secure member account';
        }
        function updateMessageTopBadge(count){
            count=Number(count)||0;
            ['messageBadge','topMessageBadge'].forEach(function(id){var el=document.getElementById(id);if(!el)return;el.textContent=count>99?'99+':String(count);el.style.display=count>0?'flex':'none';});
        }
        function isCurrentUserAdmin(){
            var role=String((currentUser&&currentUser.role)||sessionStorage.getItem('memberRole')||'').toLowerCase();
            return role==='admin'||role==='super_admin';
        }
        function adminQuickActionsHtml(context){
            if(!isCurrentUserAdmin()) return '';
            var label=context==='home'?'Edit Home Page':context==='water'?'Edit Water Supply':context==='poultry'?'Edit Poultry':context==='training'?'Edit Training':'Manage Website Content';
            return '<div class="admin-page-toolbar"><div class="admin-page-toolbar-title"><i class="fas fa-shield-halved"></i><span>Authorized Administrator</span><small>Content controls</small></div><div class="admin-page-toolbar-actions"><button class="btn-sm btn-primary" onclick="navigateTo(\'contentmanagement\')"><i class="fas fa-pen-to-square"></i> '+label+'</button><button class="btn-sm btn-outline" onclick="navigateTo(\'adminsettings\')"><i class="fas fa-sliders"></i> Admin Settings</button><button class="btn-sm btn-outline" onclick="showPublicHome()"><i class="fas fa-globe"></i> View Public Website</button></div></div>';
        }
        var brightlifeImportState={type:'',headers:[],rows:[],fileName:''};
        var BRIGHTLIFE_IMPORT_TEMPLATES={
            existing_members:{label:'Existing Member Accounts',headers:['full_name','id_number','phone_number','email','joining_date','opening_savings','occupation','address','next_of_kin','next_of_kin_phone','next_of_kin_relation'],required:['full_name','id_number','phone_number','joining_date']},
            savings:{label:'Historical Savings',headers:['member_id','transaction_date','amount','notes'],required:['member_id','transaction_date','amount']},
            withdrawals:{label:'Historical Withdrawals',headers:['member_id','transaction_date','amount','notes'],required:['member_id','transaction_date','amount']},
            loans:{label:'Historical Loans',headers:['member_id','loan_reference','loan_date','amount','interest_rate','repayment_period','total_repayment','amount_paid','reference'],required:['member_id','loan_date','amount','interest_rate','repayment_period']},
            loan_repayments:{label:'Historical Loan Repayments',headers:['member_id','loan_reference','repayment_date','amount','reference','notes'],required:['member_id','loan_reference','repayment_date','amount']},
            finance_entries:{label:'Income & Expenses',headers:['entry_type','entry_date','category','amount','description','payment_method','reference_no'],required:['entry_type','entry_date','amount']},
            procurement_requests:{label:'Procurement Records',headers:['request_date','category','item_description','quantity','estimated_amount','approved_amount','status','supplier_name','notes'],required:['request_date','category','item_description','estimated_amount']}
        };
        function csvCell_(v){var s=String(v==null?'':v);return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
        function downloadImportTemplate(type){var t=BRIGHTLIFE_IMPORT_TEMPLATES[type];if(!t)return;var csv=t.headers.map(csvCell_).join(',')+'\n';var blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='brightlife_'+type+'_template.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},500);}
        function parseClientCsv_(text){var rows=[],row=[],cell='',quoted=false;for(var i=0;i<text.length;i++){var ch=text[i],next=text[i+1];if(ch==='"'){if(quoted&&next==='"'){cell+='"';i++;}else quoted=!quoted;}else if(ch===','&&!quoted){row.push(cell);cell='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&next==='\n')i++;row.push(cell);cell='';if(row.some(function(v){return String(v).trim()!=='';})){rows.push(row);}row=[];}else cell+=ch;}if(cell!==''||row.length){row.push(cell);if(row.some(function(v){return String(v).trim()!=='';}))rows.push(row);}if(!rows.length)throw new Error('The uploaded file is empty.');var headers=rows.shift().map(function(h){return String(h||'').trim().toLowerCase().replace(/\s+/g,'_');});return {headers:headers,rows:rows.map(function(r){var o={};headers.forEach(function(h,j){o[h]=String(r[j]||'').trim();});return o;})};}
        function handleImportFile(input){var file=input&&input.files&&input.files[0];if(!file)return;var type=(document.getElementById('dataImportType')||{}).value||'';var reader=new FileReader();reader.onload=function(e){try{var parsed=parseClientCsv_(e.target.result||'');var t=BRIGHTLIFE_IMPORT_TEMPLATES[type];var missing=(t.required||[]).filter(function(h){return parsed.headers.indexOf(h)<0;});if(missing.length)throw new Error('Missing required columns: '+missing.join(', '));var invalidRequired=[];(parsed.rows||[]).forEach(function(row,i){(t.required||[]).forEach(function(h){if(!String(row[h]||'').trim())invalidRequired.push('Row '+(i+2)+': '+h);});});if(invalidRequired.length){var msg=invalidRequired.slice(0,8).join('; ');if(invalidRequired.length>8)msg+='; and '+(invalidRequired.length-8)+' more';throw new Error('Required values are missing in the import file: '+msg);}if(parsed.rows.length>2000)throw new Error('Maximum 2,000 rows per import file.');brightlifeImportState={type:type,headers:parsed.headers,rows:parsed.rows,fileName:file.name};renderImportPreview_();showToast(parsed.rows.length+' row(s) ready for preview.','success');}catch(err){showToast(err.message||'Unable to read import file.','error');}};reader.readAsText(file);}
        function renderImportPreview_(){var el=document.getElementById('dataImportPreview');if(!el)return;var s=brightlifeImportState;if(!s.rows.length){el.innerHTML='<div class="text-muted">No rows loaded.</div>';return;}var sample=s.rows.slice(0,10);el.innerHTML='<div style="font-weight:900;margin-bottom:10px">Preview · '+s.rows.length+' row(s)</div><div class="table-scroll"><table class="pro-table"><thead><tr>'+s.headers.map(function(h){return '<th>'+escapeHtml(h)+'</th>';}).join('')+'</tr></thead><tbody>'+sample.map(function(r){return '<tr>'+s.headers.map(function(h){return '<td>'+escapeHtml(r[h]||'')+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>'+(s.rows.length>10?'<div class="text-muted" style="margin-top:8px">Showing first 10 rows in preview.</div>':'');}
        async function runDataImport(){var s=brightlifeImportState;if(!s.rows.length){showToast('Choose a CSV file and preview it first.','warning');return;}var memberId=getCanonicalMemberId();if(!memberId)return;var csv=s.headers.map(csvCell_).join(',')+'\n'+s.rows.map(function(r){return s.headers.map(function(h){return csvCell_(r[h]||'');}).join(',');}).join('\n');var btn=document.getElementById('runDataImportBtn');if(btn)btn.disabled=true;try{var r=await callServer('importDataFile',{actorId:memberId,sessionToken:sessionStorage.getItem('brightlifeSessionToken')||'',importType:s.type,csvText:csv,fileName:s.fileName},{force:true});if(!r||!r.success)throw new Error(r&&r.message||'Import failed.');showToast(r.message||'Import completed.','success');brightlifeImportState={type:'',headers:[],rows:[],fileName:''};var f=document.getElementById('dataImportFile');if(f)f.value='';renderImportPreview_();}catch(e){showToast(e.message||'Import failed.','error');}finally{if(btn)btn.disabled=false;}}
        async function loadDataImportPage(){
            var el=document.getElementById('dashboardContent');if(!el)return;
            setMemberTopbarPage('dataimport','Data Importation','Import approved historical and operational records without replacing existing records.');
            el.innerHTML='<div class="dashboard-body"><div class="welcome-hero"><div><div class="welcome-kicker">Authorized Administration</div><div class="welcome-title">Data Importation</div><div class="welcome-sub">Add existing members and migrate historical savings, withdrawals, loans, repayments, finance and procurement records. Existing records are not overwritten.</div></div></div><div class="section-card"><div class="section-title"><i class="fas fa-file-import"></i> Import source</div><div class="form-group"><label>Data type</label><select id="dataImportType" class="form-control" onchange="brightlifeImportState={type:this.value,headers:[],rows:[],fileName:\'\'};var p=document.getElementById(\'dataImportPreview\');if(p)p.innerHTML=\'<div class=\"text-muted\">Select a CSV file to preview.</div>\';"><option value="existing_members">Existing Member Accounts</option><option value="savings">Historical Savings</option><option value="withdrawals">Historical Withdrawals</option><option value="loans">Historical Loans</option><option value="loan_repayments">Historical Loan Repayments</option><option value="finance_entries">Income & Expenses</option><option value="procurement_requests">Procurement Records</option></select></div><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px"><input type="file" id="dataImportFile" accept=".csv,text/csv" onchange="handleImportFile(this)" class="form-control" style="max-width:420px"><button class="btn-outline" type="button" onclick="downloadImportTemplate((document.getElementById(\'dataImportType\')||{}).value)"><i class="fas fa-download"></i> Download Template</button></div><div id="dataImportPreview" style="margin-top:18px"><div class="text-muted">Select a CSV file to preview.</div></div><div style="display:flex;justify-content:flex-end;margin-top:16px"><button id="runDataImportBtn" class="btn-primary" type="button" onclick="runDataImport()"><i class="fas fa-cloud-arrow-up"></i> Import Records</button></div></div><div class="section-card"><div class="section-title"><i class="fas fa-circle-info"></i> Import rules</div><ul style="margin:0;padding-left:20px;color:var(--gray-600);font-size:12px;line-height:1.8"><li>Maximum 2,000 rows per CSV file.</li><li>Use the exact downloaded template headers.</li><li>Existing member accounts are assigned the next CDO number automatically and use National ID as the initial password.</li><li>Historical dates are preserved and feed the member account and organization dashboards.</li><li>Import is additive; it does not replace existing records.</li></ul></div></div>';
        }

        
        async function loadContentManagementPage(){
            var memberId=getCanonicalMemberId(), role=String(sessionStorage.getItem('memberRole')||'').toLowerCase();
            if(!memberId || (role!=='admin' && role!=='super_admin')){showToast('Authorized personnel only.','error');return;}
            setMemberTopbarPage('contentmanagement','Content Management','Update approved CBO information, photos and community notes.');
            var el=document.getElementById('dashboardContent');
            el.innerHTML='<div class="dashboard-body"><div class="section-card"><div style="text-align:center;padding:35px"><i class="fas fa-spinner fa-spin" style="font-size:28px;color:var(--primary)"></i><p>Loading content manager…</p></div></div></div>';
            try{
                var result=await callServer('getSiteContentAdmin',{memberId:memberId,actorId:memberId,sessionToken:sessionStorage.getItem('brightlifeSessionToken')||''},{force:true});
                if(!result||!result.success)throw new Error(result&&result.message||'Unable to load content manager.');
                var rows=result.items||[];
                var byKey={}; rows.forEach(function(r){byKey[r.content_key]=r;});
                var sections=[
                    ['projects_intro','Projects — Page Introduction','Controls the introduction shown at the top of the public Projects page.'],
                    ['home_hero','Home — Hero Section','Main heading, introduction and optional hero image.'],
                    ['home_about','Home — Who We Are','Organizational introduction.'],
                    ['home_feature','Home — Featured Update','Current community highlight for the Home page.'],
                    ['water','Clean Water, Treatment & Water Vending','Water programme and project notes, progress and photo.'],
                    ['poultry','Poultry Farming','Poultry livelihood activities, progress and photo.'],
                    ['agriculture','Agriculture & Livelihoods','Agriculture, kitchen gardens, small livestock, agribusiness and value addition.'],
                    ['bike_skills','Bike Repair & Vocational Skills','Vocational maintenance, repair, safety, customer service and business skills.'],
                    ['education','Education Support','Education materials, mentorship, career guidance, vocational training and life skills.'],
                    ['entrepreneurship','Entrepreneurship & Small Business','Small-business development, enterprise skills and income-generation activities.'],
                    ['women','Women Empowerment','Women-focused development, skills, economic participation and leadership.'],
                    ['youth','Youth Empowerment','Youth skills, mentorship, entrepreneurship and participation.'],
                    ['financial_literacy','Financial Literacy','Practical financial education for responsible saving, borrowing and enterprise.'],
                    ['community_development','Community Development','Water, sanitation, education, agriculture, skills, environment, health awareness, entrepreneurship, youth, women and welfare.'],
                    ['other','Other Community Projects','Additional approved initiatives and community updates.'],
                    ['training','Training & Capacity Building','Seminars, workshops, community training, lessons and photos.']
                ];
                var html='<div class="dashboard-body"><div class="welcome-hero"><div><div class="welcome-kicker">Authorized Personnel</div><div class="welcome-title">CBO Content Management</div><div class="welcome-sub">Publish clear, factual updates for members and the public. Financial records remain separate from this area.</div></div></div><div class="section-card" style="margin-bottom:14px;border-left:4px solid var(--primary);"><div class="section-title"><i class="fas fa-layer-group"></i> Projects are administrator-managed</div><p style="font-size:12px;color:var(--gray-600);line-height:1.7;margin:0;">Update any project whenever there is new approved information. Change the title, description and photo URL, then press <strong>Save &amp; Publish</strong>. The public Projects page reads the published content directly, so you do not need to edit the website code for routine project updates.</p></div><div class="site-grid">';
                sections.forEach(function(sec){var r=byKey[sec[0]]||{};html+='<div class="section-card content-editor-card" style="grid-column:1/-1"><div class="section-title"><i class="fas fa-pen-to-square"></i> '+escapeHtml(sec[1])+'</div><p style="font-size:11px;color:var(--gray-500);margin:0 0 14px">'+escapeHtml(sec[2])+'</p><div class="content-editor-grid"><div class="form-group"><label>Title / Heading</label><input class="form-control" id="contentTitle_'+sec[0]+'" value="'+escapeHtml(r.title||'')+'" placeholder="Enter title"></div><div class="form-group"><label>Photo URL (optional)</label><input class="form-control" id="contentPhoto_'+sec[0]+'" value="'+escapeHtml(r.image_url||'')+'" placeholder="https://..." oninput="updateContentPhotoPreview(&quot;'+sec[0]+'&quot;)"><small style="display:block;margin-top:6px;color:var(--gray-500)">Optional replacement photo. The website already includes a project photo by default; paste a public JPG, PNG or WebP URL here to replace it. Google Drive share links are converted where possible.</small><img id="contentPhotoPreview_'+sec[0]+'" alt="Photo preview" style="display:none;width:100%;max-width:360px;max-height:190px;object-fit:cover;border-radius:10px;margin-top:10px;border:1px solid #dbe3ec"><small id="contentPhotoMessage_'+sec[0]+'" style="display:block;margin-top:5px;color:#64748b">Paste a direct photo link to preview it here.</small></div><div class="form-group" style="grid-column:1/-1"><label>Notes / Description</label><textarea class="form-control" id="contentBody_'+sec[0]+'" rows="4" placeholder="Write the approved update…">'+escapeHtml(r.body||'')+'</textarea></div></div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn-primary" onclick="saveSiteContent(&quot;'+sec[0]+'&quot;)"><i class="fas fa-cloud-arrow-up"></i> Save & Publish</button></div></div>';});
                html+='</div></div>';el.innerHTML=html;
                sections.forEach(function(sec){updateContentPhotoPreview(sec[0]);});
            }catch(e){el.innerHTML='<div class="dashboard-body"><div class="section-card"><div class="alert alert-error">'+escapeHtml(e.message||'Unable to load content manager.')+'</div></div></div>';}
        }
        async function saveSiteContent(key){
            var memberId=getCanonicalMemberId();if(!memberId)return;
            var payload={memberId:memberId,actorId:memberId,sessionToken:sessionStorage.getItem('brightlifeSessionToken')||'',contentKey:key,title:(document.getElementById('contentTitle_'+key)||{}).value||'',body:(document.getElementById('contentBody_'+key)||{}).value||'',imageUrl:normalizePublicImageUrl((document.getElementById('contentPhoto_'+key)||{}).value||'')||((document.getElementById('contentPhoto_'+key)||{}).value||'').trim()};
            try{var r=await callServer('saveSiteContent',payload,{force:true});if(!r||!r.success)throw new Error(r&&r.message||'Could not save content.');showToast('Content published successfully.','success');await loadContentManagementPage();}catch(e){showToast(e.message||'Unable to save content.','error');}
        }

        async function logout() {
            try {
                var token = sessionStorage.getItem('brightlifeSessionToken') || '';
                if (token) await callServer('logoutMember', {sessionToken:token}, {force:true});
            } catch (e) { console.warn('Logout session revoke:', e); }

            sessionStorage.clear();

            var mainWrapper = document.getElementById('mainWrapper');
            var dashboard = document.getElementById('dashboard');
            var app = document.getElementById('app');
            var sidebar = document.getElementById('sidebar');
            var overlay = document.getElementById('sidebarOverlay');
            var mobileToggle = document.getElementById('mobileMenuToggle');
            var topbar = document.getElementById('memberTopbar');
            var projectPage = document.getElementById('publicProjectPage');
            var publicLanding = document.getElementById('publicHomeLanding');

            
            if (sidebar) {
                sidebar.classList.remove('visible','open');
                sidebar.style.display = 'none';
                sidebar.setAttribute('aria-hidden','true');
            }
            if (overlay) {
                overlay.classList.remove('show');
                overlay.style.display = 'none';
            }
            if (mobileToggle) {
                mobileToggle.classList.add('hidden');
                mobileToggle.style.display = 'none';
            }
            if (topbar) {
                topbar.style.display = 'none';
                topbar.setAttribute('aria-hidden','true');
            }
            if (projectPage) {
                projectPage.style.display = 'none';
                projectPage.innerHTML = '';
            }
            if (app) app.style.display = 'none';
            if (publicLanding) publicLanding.style.display = 'none';
            if (dashboard) {
                dashboard.style.display = 'block';
                dashboard.classList.add('brightlife-public-mode');
            }
            if (mainWrapper) {
                mainWrapper.classList.remove('with-sidebar','expanded','public-projects-mode');
                mainWrapper.classList.add('public-site-mode');
                mainWrapper.style.marginLeft = '0';
                mainWrapper.style.width = '100%';
                mainWrapper.style.maxWidth = '100%';
                mainWrapper.style.padding = '0';
                mainWrapper.style.boxSizing = 'border-box';
            }
            document.body.classList.remove('workspace-active');
            document.body.classList.add('public-site-body');
            document.documentElement.classList.add('public-site-html');
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.width = '100%';
            document.body.style.display = 'block';
            updateUserInfo(null);

            currentPage = 'login';
            try { history.replaceState({brightlife:'login'}, '', '#member-login'); } catch (e) {}
            if (typeof openMemberLogin === 'function') openMemberLogin(false);
            try { history.replaceState({brightlife:'login'}, '', '#member-login'); } catch (e) {}
            window.scrollTo({top:0, behavior:'auto'});
            setTimeout(function(){ var loginTab=document.getElementById('loginTab'); if(loginTab) loginTab.click(); }, 0);
        }
        window.addEventListener('error', function(e) { console.error('Brightlife runtime error:', e.error || e.message); });
        window.addEventListener('unhandledrejection', function(e) { console.error('Brightlife async error:', e.reason); });

        window.addEventListener('pageshow', function() {
            if (getCanonicalMemberId() && typeof ensureAuthenticatedWorkspaceNavigation === 'function') {
                setTimeout(function(){ ensureAuthenticatedWorkspaceNavigation(); }, 0);
                setTimeout(function(){ ensureAuthenticatedWorkspaceNavigation(); }, 150);
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && getCanonicalMemberId() && typeof ensureAuthenticatedWorkspaceNavigation === 'function') ensureAuthenticatedWorkspaceNavigation();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const memberId = getCanonicalMemberId();
            const memberName = sessionStorage.getItem('memberName') || 'Guest';
            const memberRole = sessionStorage.getItem('memberRole') || '';
            const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}');

            if (memberId) {
                var bootLoader = document.getElementById('brightlifeBootLoader');
                if (bootLoader) bootLoader.style.display = 'flex';
                var publicLandingAtBoot = document.getElementById('publicHomeLanding');
                if (publicLandingAtBoot) publicLandingAtBoot.style.display = 'none';
                const nameParts = memberName.split(' ');
                const initials = nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
                document.getElementById('userAvatar').textContent = initials;
                document.getElementById('userName').textContent = memberName;
                const roleDisplay = memberRole === 'super_admin' ? '👑 Super Admin' :
                    memberRole === 'admin' ? '👑 Administrator' :
                    memberRole === 'treasurer' ? '💰 Treasurer' :
                    memberRole === 'customer_care' ? '💬 Customer Care' :
                    memberRole === 'profile_approver' ? '📝 In-charge / Profile Approver' : 'Member';
                document.getElementById('userRole').textContent = roleDisplay;

                const hasAdminAccess = memberRole === 'super_admin' || memberRole === 'admin' || memberRole === 'treasurer' || memberRole === 'customer_care' || memberRole === 'profile_approver' || permissions.view_members ||
                    permissions.loan_approval || permissions.savings_approval ||
                    permissions.withdrawal_approval || permissions.registration_approval ||
                    permissions.grant_rights || permissions.customer_care || permissions.view_reports ||
                    permissions.profile_approval || permissions.view_savings ||
                    permissions.edit_members || permissions.view_repayments || permissions.view_transactions;
                const hasManagementDashboard = memberRole === 'super_admin' || memberRole === 'admin' || memberRole === 'treasurer' || memberRole === 'customer_care' || memberRole === 'profile_approver' || permissions.view_reports || permissions.view_members || permissions.loan_approval || permissions.savings_approval || permissions.withdrawal_approval || permissions.registration_approval || permissions.grant_rights || permissions.customer_care || permissions.profile_approval || permissions.edit_members || permissions.view_repayments || permissions.view_transactions;

                setElementDisplaySafe('adminSection', hasAdminAccess ? 'block' : 'none');
                setElementDisplaySafe('nav-admin', hasManagementDashboard ? 'flex' : 'none');
                const canApprove = memberRole === 'super_admin' || memberRole === 'admin' || permissions.registration_approval || permissions.savings_approval || permissions.loan_approval || permissions.withdrawal_approval || permissions.profile_approval;
                if (document.getElementById('nav-approvals')) setElementDisplaySafe('nav-approvals', 'none');
                setElementDisplaySafe('nav-rights', (memberRole === 'super_admin' || memberRole === 'admin' || permissions.grant_rights) ? 'flex' : 'none');
                setElementDisplaySafe('nav-members', (memberRole === 'super_admin' || memberRole ===
                    'admin' || permissions.view_members) ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-reports', 'flex');
                setElementDisplaySafe('nav-admin-repayments', (memberRole === 'super_admin' || memberRole ===
                    'admin' || permissions.view_repayments) ? 'flex' : 'none');
                setElementDisplaySafe('nav-chat', (memberRole === 'super_admin' || memberRole === 'admin' || permissions.customer_care) ? 'flex' : 'none');
                setElementDisplaySafe('nav-alltransactions', (memberRole === 'super_admin' || memberRole ===
                    'admin' || permissions.view_transactions) ? 'flex' : 'none');
                setElementDisplaySafe('nav-admin-profile', (memberRole === 'super_admin' || memberRole === 'admin') ? 'flex' : 'none');
                if (document.getElementById('nav-adminsettings-main')) setElementDisplaySafe('nav-adminsettings-main', (memberRole === 'super_admin' || memberRole === 'admin') ? 'flex' : 'none');

                setElementDisplaySafe('nav-settings', 'flex');

                refreshAccountAccess_().then(function(account){
                    if (!account || !account.member) return;
                    updateUserInfo(account.member);
                    showAuthenticatedShell(account.member);
                    updateUserInfo(account.member);
                    showSidebar();
                    if (bootLoader) bootLoader.style.display = 'none';
                    var initialRoute=(window.location.hash||'').replace('#','');
                    var secureInitial={dashboard:1,savings:1,loans:1,loanmanagement:1,guarantors:1,repayments:1,transactions:1,reports:1,profile:1,messages:1,settings:1,contentmanagement:1,adminsettings:1,admin:1,members:1,alltransactions:1,executive:1,chat:1,rights:1};
                    if(secureInitial[initialRoute]) navigateTo(initialRoute); else loadDashboard(true);
                }).catch(function(error){
                    console.error('Account verification failed:', error);
                    sessionStorage.clear();
                    updateUserInfo(null);
                    if (bootLoader) bootLoader.style.display = 'none';
                    showPublicHome();
                    hideSidebar();
                });
            } else {
                var guestBootLoader = document.getElementById('brightlifeBootLoader');
                if (guestBootLoader) guestBootLoader.style.display = 'none';
                updateUserInfo(null);
                showPublicHome(false);
                hideSidebar();
                try {
                    var memberAction = new URLSearchParams(window.location.search).get('member');
                    var publicRoute = (window.location.hash || '').replace('#','');
                    if (memberAction === 'login') setTimeout(function(){ openMemberLogin(); }, 80);
                    else if (memberAction === 'register') setTimeout(function(){ openMemberRegistration(); }, 80);
                    else if (['about','programs','approach','finance','membership','projects','partner','contact'].indexOf(publicRoute) >= 0) setTimeout(function(){ showBrightlifeInnerPage(publicRoute, false); }, 80);
                } catch (e) {}
                setElementDisplaySafe('nav-settings', 'none');
                setElementDisplaySafe('nav-chat', 'none');
                setElementDisplaySafe('nav-alltransactions', 'none');
                setElementDisplaySafe('nav-admin-profile', 'none');
                if (document.getElementById('nav-adminsettings-main')) setElementDisplaySafe('nav-adminsettings-main', 'none');
                setElementDisplaySafe('nav-executive', 'none');
                document.getElementById('mobileMenuToggle').classList.add('hidden');
            }
        });
    