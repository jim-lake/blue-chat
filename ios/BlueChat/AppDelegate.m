
#import "AppDelegate.h"

#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
#if TARGET_IPHONE_SIMULATOR
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
#elif defined(DEV_IP_PORT)
  jsCodeLocation = [NSURL URLWithString:@"http://" DEV_IP_PORT "/index.ios.bundle?platform=ios&dev=true"];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"BlueChat"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UITextField *lagFreeField = [[UITextField alloc] init];
  [self.window addSubview:lagFreeField];
  [lagFreeField becomeFirstResponder];
  [lagFreeField resignFirstResponder];
  [lagFreeField removeFromSuperview];

  return YES;
}

@end
