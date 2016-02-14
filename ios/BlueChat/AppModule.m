
#import "RCTBridgeModule.h"

@interface AppModule : NSObject <RCTBridgeModule>

@end

@implementation AppModule

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getVersions:(RCTResponseSenderBlock)callback)
{
  NSDictionary *bundleDict = [[NSBundle mainBundle] infoDictionary];
  NSString *appVersion = [bundleDict objectForKey:@"CFBundleShortVersionString"];
  NSString *buildNumber = [bundleDict objectForKey:(NSString *)kCFBundleVersionKey];
  NSString *bundleId = [bundleDict objectForKey:(NSString *)kCFBundleIdentifierKey];

  NSDictionary *ret = @{
    @"appVersion": appVersion,
    @"buildNumber": buildNumber,
    @"bundleId": bundleId,
  };
  callback(@[[NSNull null],ret]);
}

@end
