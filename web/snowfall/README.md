## SNOWfall

| Author | Category | Difficulty | Points | Solves | First Blood |
| ------ | -------- | ---------- | ------ | ------ | ----------- |
| ahh    | Web      | Medium     | 500    |        |             |

> [!IMPORTANT]
> Unfortunately, source code for this challenge will be undisclosed. However, [SNOWfall.zip](dist) is still provided.

---

### Description

> Flag is at [https://dev258962.service-now.com/flag](https://dev258962.service-now.com/flag), thats it!
> Oh you might need a special role for it, but I hear its not too hard to request.
> 
> ## Platform Information
> - The platform is a fresh ServiceNow Utah PDI with the provided updates applied
> - The `com.glide.service-portal.user-criteria` (disabled by default) plugin is enabled
> 
> ## Credentials
> Please request instance credentials via the GZCTF container. Note that the container is purely for requesting credentials and is not in scope for the challenge. The challenge is hosted on the provided external url.
> - Spawn a container, and connect to it using `wsrx` and `nc`
> - When prompted, enter your Team Token 
>     - This can be found under your team name and current rank, by clicking on the dots between the key and eye icon on https://ctf.sdc.tf/games/5/challenges
> - Note down the username and password provided
> - Login to the instance at [https://dev258962.service-now.com/sp](https://dev258962.service-now.com/sp) using those credentials

> [!NOTE]
> As since this is a third-party instance, **NO BRUTE FORCE** of any kind (No automation / brute force of any kind is needed to solve this challenge). Additionally, the only domain in scope is the provided one. **DO NOT ATTEMPT** to test any other `*.service-now.com` domain NOR any `*.servicenow.com` domain. 

### Hints

1. > https://developer.servicenow.com/dev.do#!/learn/learning-plans/utah/new_to_servicenow/app_store_learnv2_buildmyfirstapp_utah_personal_developer_instances
2. > https://docs.servicenow.com/bundle/utah-it-service-management/page/product/site-reliability-ops/task/sro-update-set-quick-start.html
3. > New attachment uploaded to the challenge. The new zip file has the same SNOWfall.xml file, but now contains a README with some detailed instructions and tips for setting up a personal instance.
4. > How to run Javascript server side: https://developer.servicenow.com/blog.do?p=/post/training-scriptsbg/

### Challenge Files

[SNOWfall.zip](dist)
