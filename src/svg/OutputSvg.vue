<template>
  <div>
    <div>
      <svg width="24px" height="19px" viewBox="0 0 24 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Output</title>
        <desc>Created with sketchtool.</desc>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="00vtranscode/Provider/Dashboard" transform="translate(-28.000000, -260.000000)" :fill="fill">
                <g id="Skin/provider">
                    <g id="Group">
                        <g id="Provider-sidemenu" transform="translate(0.000000, 50.000000)">
                            <g id="Menu111" transform="translate(0.000000, 24.000000)">
                                <g id="Group-20">
                                    <g id="Menu_item-Copy-6" transform="translate(0.000000, 170.000000)">
                                        <g id="ic_dashboard" transform="translate(28.000000, 16.103736)">
                                            <path d="M6.42292272,0.336820906 C6.58821617,0.336820906 6.74937893,0.38920575 6.88388374,0.486653116 L18.1180768,8.62613052 L22.9503458,8.62758702 C23.4978446,8.62758702 23.94168,9.07776295 23.94168,9.6330831 C23.94168,10.1884032 23.4978446,10.6385792 22.9503458,10.6385792 L18.1200595,10.6371227 L6.88388374,18.7795131 C6.5274693,19.0377317 6.03215904,18.9540007 5.77757729,18.5924946 C5.68150243,18.4560683 5.6298554,18.2926032 5.6298554,18.1249484 L5.62924915,10.6371227 L1.08497338,10.6385792 C0.537474647,10.6385792 0.093639228,10.1884032 0.093639228,9.6330831 C0.093639228,9.07776295 0.537474647,8.62758702 1.08497338,8.62758702 L5.62924915,8.62613052 L5.6298554,1.14121776 C5.6298554,0.696961646 5.98492373,0.336820906 6.42292272,0.336820906 Z" id="Path"></path>
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
      <span id="outputtitle" :style="{color: fill}">OUTPUT</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OutputSvg',
  props: ['fill']
}
</script>

<style lang='scss' scoped>
  #outputtitle {
    font-size: 10px;
    margin: -3px;
    font-weight: 600;
    letter-spacing: -0.33px;
    line-height: 11px;
    padding-top: 6px;
    display: inline-block;
  }
</style>
