import { Entity, Column, PrimaryColumn } from 'typeorm';

export type DiffStatus = 'unchanged' | 'modified' | 'added' | 'deleted';
export type DiffLineType = 'segmentgroup' | 'segment' | 'dataelementgroup' | 'dataelement' | 'code';

@Entity({ name: 'v_ahb_diff', synchronize: false })
export class AhbDiffLine {
  @PrimaryColumn({ type: 'varchar' })
  format_version_a!: string;

  @PrimaryColumn({ type: 'varchar' })
  format_version_b!: string;

  @PrimaryColumn({ type: 'varchar' })
  pruefidentifikator_a!: string;

  @PrimaryColumn({ type: 'varchar' })
  pruefidentifikator_b!: string;

  @PrimaryColumn({ type: 'varchar' })
  id_path!: string;

  @Column({ type: 'varchar', nullable: true })
  path?: string;

  @Column({ type: 'varchar', nullable: true })
  sort_path?: string;

  @Column({ type: 'varchar', nullable: true })
  type?: DiffLineType;

  @Column({ type: 'varchar', nullable: true })
  diff_status?: DiffStatus;

  @Column({ type: 'varchar', nullable: true })
  segmentgroup_name_a?: string;

  @Column({ type: 'varchar', nullable: true })
  segmentgroup_name_b?: string;

  @Column({ type: 'varchar', nullable: true })
  segmentgroup_ahb_status_a?: string;

  @Column({ type: 'varchar', nullable: true })
  segmentgroup_ahb_status_b?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_id_a?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_id_b?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_name_a?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_name_b?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_ahb_status_a?: string;

  @Column({ type: 'varchar', nullable: true })
  segment_ahb_status_b?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelementgroup_id_a?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelementgroup_id_b?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelementgroup_name_a?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelementgroup_name_b?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_id_a?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_id_b?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_name_a?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_name_b?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_ahb_status_a?: string;

  @Column({ type: 'varchar', nullable: true })
  dataelement_ahb_status_b?: string;

  @Column({ type: 'varchar', nullable: true })
  code_value_a?: string;

  @Column({ type: 'varchar', nullable: true })
  code_value_b?: string;

  @Column({ type: 'varchar', nullable: true })
  code_name_a?: string;

  @Column({ type: 'varchar', nullable: true })
  code_name_b?: string;

  @Column({ type: 'varchar', nullable: true })
  code_ahb_status_a?: string;

  @Column({ type: 'varchar', nullable: true })
  code_ahb_status_b?: string;
}
