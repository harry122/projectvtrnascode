<template>
  <div>
    <div>
      <svg width="20px" height="18px" viewBox="0 0 20 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Input</title>
        <desc>Created with sketchtool.</desc>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="00vtranscode/Provider/Dashboard" transform="translate(-30.000000, -176.000000)">
                <g id="Skin/provider">
                    <g id="Group">
                        <g id="Provider-sidemenu" transform="translate(0.000000, 50.000000)">
                            <g id="Menu111" transform="translate(0.000000, 24.000000)">
                                <g id="Group-20">
                                    <g id="Menu_item-Copy-7" transform="translate(0.000000, 85.000000)">
                                        <g id="ic_dashboard" transform="translate(30.000000, 16.103736)">
                                            <g id="Group">
                                                <rect id="Rectangle-2" x="1.46410661e-14" y="1.57581289e-13" width="20" height="20.2857143"></rect>
                                                <path d="M8.73347408,11.574817 L8.75,13.9464286 L13.125,10.1428571 L8.75,6.33928571 L8.73347408,8.7090934 L0.398762668,8.70969692 L0.399033634,3.96314973 C0.399184406,2.6302992 1.15560881,1.62409035 2.15809354,1.62368907 L17.5876739,1.62649802 C17.8290602,1.62669866 18.0785883,1.63612874 18.3103253,1.71417764 C18.914922,1.91791829 19.3056963,2.42228708 19.5022451,3.17226256 L19.6012373,3.61865111 L19.6012373,16.8111226 L19.5639966,16.9489622 C19.3734205,18.0101463 18.7572142,18.6620252 17.9389732,18.6620252 L2.0588854,18.6616239 C1.15609661,18.6614351 0.484092663,17.8378259 0.407905813,16.6748894 L0.400692129,16.4529805 L0.398762668,11.5754205 L8.73347408,11.574817 Z" id="Path" :fill="fill"></path>
                                            </g>
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
      <span id="inputtitle" :style="{color: fill}">INPUT</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InputSvg',
  props: ['fill']
}
</script>

<style lang='scss' scoped>
  #inputtitle {
    font-size: 10px;
    margin: -3px;
    font-weight: 600;
    letter-spacing: -0.33px;
    line-height: 11px;
    padding-top: 6px;
    display: inline-block;
  }
</style>
