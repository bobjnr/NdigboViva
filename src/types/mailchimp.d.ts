declare module '@mailchimp/mailchimp_marketing' {
  interface MailchimpConfig {
    apiKey: string;
    server: string;
  }

  interface ListMember {
    email_address: string;
    status: string;
    merge_fields?: {
      FNAME?: string;
      LNAME?: string;
    };
    tags?: string[];
  }

  interface Campaign {
    id?: string;
    type: string;
    recipients: {
      list_id: string;
    };
    settings: {
      subject_line: string;
      from_name: string;
      reply_to: string;
      title: string;
    };
    status?: string;
    send_time?: string;
    report_summary?: unknown;
  }

  interface CampaignContent {
    html: string;
  }

  interface CampaignSchedule {
    schedule_time: string;
  }

  interface ListStats {
    member_count: number;
    unsubscribe_count: number;
    cleaned_count: number;
    member_count_since_send: number;
    unsubscribe_count_since_send: number;
    cleaned_count_since_send: number;
    campaign_count: number;
    campaign_last_sent: string;
    merge_field_count: number;
    avg_sub_rate: number;
    avg_unsub_rate: number;
    target_sub_rate: number;
    open_rate: number;
    click_rate: number;
  }

  interface List {
    id: string;
    name: string;
    stats: ListStats;
  }

  interface Tag {
    name: string;
    status: string;
  }

  interface UpdateTagsRequest {
    tags: Tag[];
  }

  const mailchimp: {
    setConfig(config: MailchimpConfig): void;
    lists: {
      addListMember(listId: string, member: ListMember): Promise<unknown>;
      updateListMember(listId: string, subscriberHash: string, member: Partial<ListMember>): Promise<unknown>;
      getListMember(listId: string, subscriberHash: string): Promise<unknown>;
      getList(listId: string): Promise<List>;
      updateListMemberTags(listId: string, subscriberHash: string, tags: UpdateTagsRequest): Promise<unknown>;
    };
    campaigns: {
      create(campaign: Campaign): Promise<Campaign>;
      setContent(campaignId: string, content: CampaignContent): Promise<unknown>;
      schedule(campaignId: string, schedule: CampaignSchedule): Promise<unknown>;
      send(campaignId: string): Promise<unknown>;
      get(campaignId: string): Promise<Campaign>;
    };
  };

  export default mailchimp;
}
