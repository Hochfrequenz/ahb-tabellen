import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MsalCallbackComponent } from './msal-callback.component';
import { POST_LOGIN_TARGET_KEY } from './login.component';
import { AuthFacade } from '../../core/auth/auth.facade';

describe('MsalCallbackComponent', () => {
  let facade: { initializeMsal: jest.Mock };
  let router: { navigateByUrl: jest.Mock };

  function create(): MsalCallbackComponent {
    facade = { initializeMsal: jest.fn().mockResolvedValue(undefined) };
    router = { navigateByUrl: jest.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      imports: [MsalCallbackComponent],
      providers: [
        { provide: AuthFacade, useValue: facade },
        { provide: Router, useValue: router },
      ],
    });
    return TestBed.createComponent(MsalCallbackComponent).componentInstance;
  }

  afterEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('finishes MSAL sign-in and navigates to the stored target', async () => {
    sessionStorage.setItem(POST_LOGIN_TARGET_KEY, '/search');
    const component = create();
    await component.ngOnInit();
    expect(facade.initializeMsal).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/search');
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
  });

  it('navigates home when there is no stored target', async () => {
    const component = create();
    await component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('navigates home instead of following an unsafe (tampered) stored target', async () => {
    sessionStorage.setItem(POST_LOGIN_TARGET_KEY, '//evil.com');
    const component = create();
    await component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
