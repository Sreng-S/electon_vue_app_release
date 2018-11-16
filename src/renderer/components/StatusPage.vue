<template>
  <div id="wrapper">
    <div class="main container clearfix">
      <div class="header">
        <img src="~@/assets/images/logo.png">
      </div>

      <div class="status">
        <div class="status__group">
          <img id="img__running" src="~@/assets/images/green_light.png">
          <span>Running</span>
        </div>
        <div class="status__group">
          <img id="img__database" src="~@/assets/images/green_light.png">
          <span>database</span>
        </div>
        <div class="status__group">
          <img id="img__sync" src="~@/assets/images/green_light.png">
          <span>sync</span>
        </div>
      </div>

      <div class="address">
        <span class="address__title">VRX SERVER ADDRESS</span>
        <span class="address__ip">{{ipAddress}}</span>
      </div>

      <div id="terminal_wrapper" class="terminal">
        <!-- jquery terminal -->
      </div>

    </div>
  </div>
</template>

<script>
  // import io from 'socket.io-client'
  // import io from '../assets/js/sails.io.js'
  const socketIOClient = require('socket.io-client')
  const sailsIOClient = require('sails.io.js')
  const io = sailsIOClient(socketIOClient)
  io.sails.url = 'http://localhost:1337'

  export default {
    name: 'status-page',
    data () {
      return {
        ipAddress: ' - - - - '
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      async getIp () {
        // server ip get
        // this.ipAddress = '12.131.10.2'
        // console.log(this.ipAddress)
        io.socket.get('/get-ip', await function (resData, jwRes) {
          console.log(resData.data.ip)
          console.log(this.ipAddress)
          // this.ipAddress = resData.data.ip
          return resData.data.ip
        })
      }
    },
    mounted () {
      this.getIp()
    },
    computed: {

    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    background-color: black;
  }

  .container {
    max-width: 600px;
    margin: auto;
    text-align: center;
  }

  div.header {
    -webkit-transition: 6s;
    -moz-transition: 6s;
    -o-transition: 6s;
    transition: 6s;
    padding: 20px 0 35px;
    display: inline-flex;
  }

  .header h1#main-title {
    color: #fff;
    font-weight: 300;
    font-size: 2.5em;
  }

  .header h3 {
    color: #b1eef7;
    font-style: italic;
    font-weight: 300;
    padding-top: 5px;
  }

  .header h3 code {
    font-style: normal !important;
    background-color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
    color: #0e6471;
    margin: 0 5px;
  }

  img {
    display: inline-block;
  }

  div.status {
    display: inline-flex;
    vertical-align: middle;
    border-radius: 5px;
    border: 3px ridge #2e2e2e;
    padding: 0 0 10px;
    width: 80%;
  }

  div.status__group {
    padding: 0 15px;
  }

  div.status__group img {
    width: 95px;
    height: auto;
  }

  div.status span {
    text-transform: uppercase;
    color: #fff;
    font-family: 'Consolas', 'Monaco', monospace;
  }

  div.address {
    display: inline-grid;
    width: 80%;
  }

  div.address span {
    color: #fff;
    font-family: 'Consolas', 'Monaco', monospace;
  }

  .address__title {
    padding: 30px 0 5px;
  }

  .address__ip {
    border-radius: 5px;
    border: 3px ridge #2e2e2e;
    padding: 10px 0;
  }

  div.terminal {
    text-align: left;
    width: 80%;
    border-radius: 5px;
    border: 3px ridge #2e2e2e;
    margin: 30px 0;
    display: inline-flex;
  }

  ::selection {
    background: transparent;
  }

</style>
