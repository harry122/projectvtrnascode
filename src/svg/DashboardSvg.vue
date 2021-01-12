<template>
  <div>
    <div>
      <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: sketchtool 63.1 (101010) - https://sketch.com -->
        <title>Dashboard</title>
        <desc>Created with sketchtool.</desc>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="01vCRM/Provider/Tikets" transform="translate(-30.000000, -90.000000)">
                <g id="Skin/provider">
                    <g id="Group">
                        <g id="Provider-sidemenu" transform="translate(0.000000, 50.000000)">
                            <g id="Group-20" transform="translate(0.000000, 24.000000)">
                                <g id="Menu_item2">
                                    <g id="ic_dashboard" transform="translate(27.000000, 13.103736)">
                                        <g id="ic_assessment_black_24px" transform="translate(0.500000, 0.464286)">
                                            <path d="M19.7916667,3.16964286 L5.20833333,3.16964286 C4.0625,3.16964286 3.125,4.12053571 3.125,5.2827381 L3.125,20.0744048 C3.125,21.2366071 4.0625,22.1875 5.20833333,22.1875 L19.7916667,22.1875 C20.9375,22.1875 21.875,21.2366071 21.875,20.0744048 L21.875,5.2827381 C21.875,4.12053571 20.9375,3.16964286 19.7916667,3.16964286 Z M9.375,17.9613095 L7.29166667,17.9613095 L7.29166667,10.5654762 L9.375,10.5654762 L9.375,17.9613095 Z M13.5416667,17.9613095 L11.4583333,17.9613095 L11.4583333,7.39583333 L13.5416667,7.39583333 L13.5416667,17.9613095 Z M17.7083333,17.9613095 L15.625,17.9613095 L15.625,13.735119 L17.7083333,13.735119 L17.7083333,17.9613095 Z" id="Shape" :fill="fill"></path>
                                            <polygon id="Shape" points="0 0 25 0 25 25.3571429 0 25.3571429"></polygon>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
      </svg>
    </div>
    <div>
      <span id="dashboardtitle" :style="{color: fill}">DASHBOARD</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DashboardSvg',
  props: ['fill']
}
</script>

<style lang='scss' scoped>
  #dashboardtitle{
    font-size: 10px;
    margin: -3px;
    font-weight: 600;
    letter-spacing: -0.33px;
    line-height: 11px;
    padding-top: 6px;
    display: inline-block;
  }
</style>
