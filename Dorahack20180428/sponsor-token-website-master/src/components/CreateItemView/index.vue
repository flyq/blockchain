<template>
  <div>
    <template v-if="!selectedContract">
      <div class="box">
        <h1 class="title has-text-centered is-4">
          选择一个合约，创建您的签名
        </h1>
      </div>
      <div class="columns is-mobile is-multiline">
        <router-link class="column is-one-third"
                     v-for="(contract, index) in contracts"
                     :key="index"
                     :to="{ name: 'CreateItem', query:{address: contract.address}}">
          <ContractCard :contract='contract' />
        </router-link>
      </div>
    </template>

    <template v-if="selectedContract">
      <div class="box">
        <router-link :to="{ name: 'CreateItem'}"
                     class="is-pulled-right button is-small is-info is-outlined">使用其他智能合约</router-link>
        <h1 class="title is-4">
          {{selectedContract.name}}
        </h1>
        <div>
          {{selectedContract.bio}}
        </div>
      </div>

      <Sponsor005CreateForm :contract="selectedContract"
                            v-if="selectedContract.component === 'Sponsor005'" />
      <HotPotatoCreateForm :contract="selectedContract"
                           v-else-if="selectedContract.component === 'HotPotato'" />
      <BetCreateForm :contract="selectedContract"
                     v-else-if="selectedContract.component === 'Bet'" />
      <div v-else>
        未找到合约对应的前端Component
      </div>

    </template>
  </div>
</template>

<script>
import { CreateForm as Sponsor005CreateForm } from '@/components/Contracts/Sponsor005';
import { CreateForm as HotPotatoCreateForm } from '@/components/Contracts/HotPotato';
import { CreateForm as BetCreateForm } from '@/components/Contracts/Bet';
import xApi from '@/xApi';
import ContractCard from './ContractCard';

export default {
  components: {
    ContractCard,
    Sponsor005CreateForm,
    HotPotatoCreateForm,
    BetCreateForm,
  },

  data: () => ({
    contracts: [],
  }),
  async created() {
    this.contracts = await xApi('getContracts');
  },
  computed: {
    selectedContract() {
      return this.contracts.find(c => c.address === this.$route.query.address);
    },
  },
  methods: {},
};
</script>

