<template>
  <div>
    <div v-if="tx"
         class="box">
      正在等待矿工确认
      <a target="_blank"
         :href="'https://ropsten.etherscan.io/tx/'+tx">（查看TX详情）</a>，请稍后刷新页面
    </div>
    <Sponsor005Detail v-if="!tx"
                      :tokenId="tokenId"
                      :contractAddress="contractAddress" />
    <!-- <Sponsor005CreateForm v-if="selectedContract.component === 'Sponsor005'" />
      <HotPotatoCreateForm v-else-if="selectedContract.component === 'HotPotato'" />
      <BetCreateForm v-else-if="selectedContract.component === 'Bet'" /> -->
  </div>
</template>

<script>
import { Detail as Sponsor005Detail } from '@/components/Contracts/Sponsor005';
import xApi from '@/xApi';

export default {
  components: {
    Sponsor005Detail,
  },
  computed: {
    tokenId() {
      return this.$route.query.id;
    },
    contractAddress() {
      return this.$route.query.address;
    },
    tx() {
      return this.$route.query.tx;
    },
  },
  data: () => ({}),
  async created() {
    if (this.tx) {
      const data = await xApi('getContractAddressAndTokenIdByTx', {
        tx: this.tx,
      });
      if (data.contractAddress && data.tokenId !== undefined) {
        this.$router.replace({
          name: 'Item',
          query: {
            address: data.contractAddress,
            id: data.tokenId,
          },
        });
      }
    }
  },
  methods: {},
};
</script>

