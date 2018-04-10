export const parametersJSON = {
  "updated_at": "2017-01-16T23:12:18",
  "warnings": {
    "first": {
      "amount": "60",
      "description": "Limit",
      "color": "#FFFF00",
      "extra_percentage": 5
    },
    "second": {
      "amount": "80",
      "description": "",
      "color": "#FF0000",
      "extra_percentage": 10
    }
  },
  "boostrap": {
    "referral": {
      "reward": 25,
      "max_referrals": 10,
      "max_supply": 0
    },
    "airdrop": {
      "max_registered_users": 10000,
      "amount": 100,
      "max_supply": 1000000
    },
    "transactions": {
      "max_refund_by_tx": 500,
      "min_refund_by_tx": 50,
      "max_supply": 5000000
    },
    "refund": [
      {
        "from_tx": 0,
        "to_tx": 10000,
        "tx_amount_percent_refunded": 25
      },
      {
        "from_tx": 10000,
        "to_tx": 50000,
        "tx_amount_percent_refunded": 15
      },
      {
        "from_tx": 50000,
        "to_tx": 100000,
        "tx_amount_percent_refunded": 10
      }
    ]
  },
  "issuing": {
    "new_member_percent_pool": "10"
  }
};

export const categoriesJSON = {
  "updated_at": "2017-01-16T23:12:18",
  "rows": [
      {
          "row" : 1,
          "description": "Menos de 200 mil"
      },
      {
          "row" : 2,
          "description": "200 mil - 500 mil"
      },
      {
          "row" : 3,
          "description": "500 mil - 750 mil"
      }
  ],
  "cols": [
      {
          "col" : 1,
          "refund_rate": 10
      },
      {
          "col" : 2,
          "refund_rate": 15
      },
      {
          "col" : 3,
          "refund_rate": 20
      }
  ],
  "categories": [
      {
          "row" : 1,
          "col" : 1,
          "initial_credit" : 2000
      },
      {
          "row" : 1,
          "col" : 2,
          "initial_credit" : 3000
      },
      {
          "row" : 1,
          "col" : 3,
          "initial_credit" : 4000
      }
  ]
};

