Orbi Pro Command Line Interface (CLI)
=====================================
Last updated 1/1/2019.

orbi-pro-cli is a command line interface for the Orbi Pro.

__Querying internet status__

    $ npx orbi-pro-cli --password="yourRouterPassword" status
    
    success

__Listing connected satellites and devices__

    $ npx orbi-pro-cli --password="yourRouterPassword" devices
    
    [
      {
        "ip": "10.0.0.34",
        "mac": "00:01:2E:2F:7C:01",
        "contype": "wired",
        "attachtype": "1",
        "devtype": "24",
        "model": "PC Partner Ltd.",
        "name": "marble",
        "accsta": "0",
        "conn_orbi_name": "io",
        "conn_orbi_mac": "8C:3B:AD:C8:96:2A",
        "backhaul_sta": "Good",
        "ledstate": "0",
        "led_func": "0",
        "sync_btn": "0",
        "uprate": "0.00",
        "downrate": "0.00",
        "voice_orbi": "0",
        "voice_lwauserid": "",
        "ceiling_power": "not support",
        "module_name": ""
      },
      ...
    ]

__Specifying a different router URL__

    $ npx orbi-pro-cli --url="http://10.0.0.1" --password="yourRouterPassword" status

*(url defaults to `https://routerlogin.net`)*




