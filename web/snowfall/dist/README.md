# SNOWFall

This challenge takes place on a third-party platform. 
The only target is the endpoint: 
- https://dev258962.service-now.com/

Please use the provided instancer to get credentials to login to the platform. Once logged in, you may want to start by looking at the Service Portal:
- https://dev258962.service-now.com/sp

## Rules
- DO NOT ATTEMPT TO TEST ANY `*.service-now.com` DOMAINS OR `*.servicenow.com` domain
- NO BRUTE FORCE OF ANY KIND IS ALLOWED, (no automation of any kind is needed to solve the challenge)
- The only domain in scope is dev258962.service-now.com

## Platform Information
- The platform is a fresh ServiceNow Utah PDI with the provided updates applied
- The `com.glide.service-portal.user-criteria` (disabled by default) plugin is enabled

## How To Setup A Personal Developer Instance
- ServiceNow provides PDI's which allow you to have your own instance, identical to the one for this challenge
- You can create a free ServiceNow account, and follow the instructions here: 
    - https://developer.servicenow.com/dev.do#!/learn/learning-plans/utah/new_to_servicenow/app_store_learnv2_buildmyfirstapp_utah_personal_developer_instances
- Once you press Start Building, you will be sent to a similar instance like remote however you will have Admin permissions
- The SNOWfall.xml file is an Update Set, which can be imported into your instance to have the same configuration as the remote instance. 
    - Navigate to the following URL to import the Update Set:
        - [INSTANCE].service-now.com/sys_remote_update_set_list.do  
        - (Replace [INSTANCE] with your instance name)
    - Click on the Import Update Set from XML link
    - Choose the SNOWfall.xml file and press Upload
    - You will be navigated to the Update Set Record, press Preview Update Set
        - This job will likely error THIS IS EXPECTED
        - This error is due to differences in the instance (kind of like a merge conflict)
    - When you scroll down now, you should see a list of Update Set Preview Problems
        - For each problem you can "Accept remote update" to resolve the issue
    - Once all issues are resolved, press Commit Update Set
        - Now the Update Set is applied to your instance
        - You can test that this works by trying to visit `/flag` on your instance!
- In addition, you will need to enable the `com.glide.service-portal.user-criteria` plugin
    - Navigate to [INSTANCE].service-now.com/nav_to.do?uri=v_plugin.do?sys_id=ide.service_portal.user_criteria
    - Click the link "Activate/Repair" and press Activate
        - This will enable the plugin on your instance


## Tips
From here, the instance is essentially the exact same as the CTF instance. As an admin, you can analyze the updates made alot easier, as well as inspect the frontend / backend source code for various forms on the platform. You can use the All search bar to poke around. What might be helpful is to look at:
- [INSTANCE].service-now.com/sys_update_set_list.do
- Then click on the name SNOWFall, and scroll down through the Customer Updates. This shows every change that I made to the instance.

Note, to get an identical user account, you can navigate to:
- [INSTANCE].service-now.com/sys_user_list.do

Once here, press New and create a new user and set the User ID to `test_user`. Then press Submit. If you look back at the `/sys_user_list.do` endpoint, you should see the new user you created. If you go back into the user record, you should see a new `Set Password` button. In the modal, press Generate to generate a password, copy it, and then press Save Password. You can use this to login to the instance using a Non Admin session (I would recommend looking at it through incognito to avoid any session issues).

