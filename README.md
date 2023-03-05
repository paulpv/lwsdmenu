# lwsdmenu

The Lake Washington School District (LWSD) menu urls at https://www.lwsd.org/students-families/breakfast-and-lunch-menus change every time they are updated.

This requires manually updating the urls to keep them up to date on a kiosk.

Example:
* 2023/03/05
    * Elementary breakfast & lunch:
        * March https://resources.finalsite.net/images/f_auto,q_auto/v1677883915/lwsdorg/tceiscxhyme3gzjonfcq/ESBkfstLunchMenuFaceBaseballMar2023.pdf
    * Middle School & High School breakfast
        * March https://resources.finalsite.net/images/f_auto,q_auto/v1677883852/lwsdorg/jdgdztdmiz3x2mls0oyu/SecondaryBkfstMenuFaceMar2023.pdf
    * Middle School lunch
        * March 6-10 https://resources.finalsite.net/images/f_auto,q_auto/v1677883705/lwsdorg/wnbsqchrrjvxxy8hfeli/DYKLunchMenuFaceMar6-102023.pdf
    * High School lunch
        * March 6-10 https://resources.finalsite.net/images/f_auto,q_auto/v1677882496/lwsdorg/lryiqxaovqemslk73ofo/HSLunchMenuFaceMar6-102023002.pdf

Those urls will change on a regular basis.

I am assuming the same/similar thing could happen with all of the nutrition guides:
* Elementary https://www.lwsd.org/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06
* Middle https://www.lwsd.org/fs/resource-manager/view/b7b45d5d-384d-45a4-b1fb-37feceec7a30
* High https://www.lwsd.org/fs/resource-manager/view/a6025cbe-6231-4137-afd6-8fa49c121e92

This Node JavaScript runs a server that selects elements out of the menu page and gets their current url.

Now the changing menu urls can be viewed with consistent urls:
* http://localhost:3000/elementary.jpg
* http://localhost:3000/middle-high-breakfast.jpg
* http://localhost:3000/middle-lunch.jpg
* http://localhost:3000/high-lunch.jpg
* http://localhost:3000/elementary-nutrition.pdf
* http://localhost:3000/middle-nutrition.pdf
* http://localhost:3000/high-nutrition.pdf


NOTE that when requesting the nutrition info you must provide a non-empty `User-Agent`.

Example:
```
% curl --user-agent '' https://www.lwsd.org/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06 
error code: 1020
% curl --user-agent 'foo' https://www.lwsd.org/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06
<html><body>You are being <a href="https://resources.finalsite.net/images/v1677883990/lwsdorg/zjuigdjrwylpgfbgdlam/ESNutrientInfo.pdf">redirected</a>.<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vaafb692b2aea4879b33c060e79fe94621666317369993" integrity="sha512-0ahDYl866UMhKuYcW078ScMalXqtFJggm7TmlUtp0UlD4eQk0Ixfnm5ykXKvGJNFjLMoortdseTfsRT8oCfgGA==" data-cf-beacon='{"rayId":"7a35bc359ff72762","token":"5fb20d0601a643df91b59062182249a8","version":"2023.2.0","si":100}' crossorigin="anonymous"></script>
</body></html>
```